from abc import ABC, abstractmethod
from typing import List


class BracketComponent(ABC):
    """
    The base component that both Match (leaf) and
    Round/Bracket/Tournament (composites) inherit from
    """

    @abstractmethod
    def is_complete(self) -> bool:
        """Check if this component is finished"""
        pass

    @abstractmethod
    def get_all_matches(self) -> List["Match"]:
        """Get all matches in this component"""
        pass

    @abstractmethod
    def get_status(self) -> str:
        """Get current status"""
        pass

    @abstractmethod
    def display(self, indent: int = 0) -> str:
        """Display structure (for debugging)"""
        pass


class Match(BracketComponent):
    """
    Leaf node - represents a single match between two players/teams
    """

    def __init__(self, match_id: str, player1: str = None, player2: str = None):
        self.match_id = match_id
        self.player1 = player1
        self.player2 = player2
        self.winner = None
        self.score = None
        self.next_match = None  # Where winner goes
        self.loser_destination = None  # Where loser goes (for double elim)

    def is_complete(self) -> bool:
        """A match is complete when it has a winner"""
        return self.winner is not None

    def get_all_matches(self) -> List["Match"]:
        """A match returns itself"""
        return [self]

    def get_status(self) -> str:
        if not self.player1 or not self.player2:
            return "PENDING"
        elif self.winner:
            return "COMPLETED"
        else:
            return "READY"

    def set_result(self, winner: str, score: str = None):
        """Set match result"""
        if winner not in [self.player1, self.player2]:
            raise ValueError("Winner must be one of the players")

        self.winner = winner
        self.score = score

        # Progress winner to next match
        if self.next_match:
            self.next_match.add_player(winner)

        # Send loser to losers bracket (if applicable)
        loser = self.player2 if winner == self.player1 else self.player1
        if self.loser_destination:
            self.loser_destination.add_player(loser)

    def add_player(self, player: str):
        """Add a player to this match"""
        if not self.player1:
            self.player1 = player
        elif not self.player2:
            self.player2 = player
        else:
            raise ValueError("Match already has two players")

    def display(self, indent: int = 0) -> str:
        spaces = "  " * indent
        status = self.get_status()
        players = f"{self.player1 or 'TBD'} vs {self.player2 or 'TBD'}"
        winner_info = f" → Winner: {self.winner}" if self.winner else ""
        return f"{spaces}Match {self.match_id}: {players} [{status}]{winner_info}"


class Round(BracketComponent):
    """
    Composite node - represents a round containing multiple matches
    """

    def __init__(self, round_number: int, round_name: str = None):
        self.round_number = round_number
        self.round_name = round_name or f"Round {round_number}"
        self.matches: List[Match] = []

    def add_match(self, match: Match):
        """Add a match to this round"""
        self.matches.append(match)

    def remove_match(self, match: Match):
        """Remove a match from this round"""
        self.matches.remove(match)

    def is_complete(self) -> bool:
        """A round is complete when ALL its matches are complete"""
        if not self.matches:
            return False
        return all(match.is_complete() for match in self.matches)

    def get_all_matches(self) -> List[Match]:
        """Get all matches in this round"""
        return self.matches.copy()

    def get_status(self) -> str:
        if not self.matches:
            return "EMPTY"
        elif self.is_complete():
            return "COMPLETED"
        elif any(match.get_status() == "READY" for match in self.matches):
            return "IN_PROGRESS"
        else:
            return "PENDING"

    def display(self, indent: int = 0) -> str:
        spaces = "  " * indent
        result = f"{spaces}{self.round_name} [{self.get_status()}]\n"
        for match in self.matches:
            result += match.display(indent + 1) + "\n"
        return result.rstrip()


class Bracket(BracketComponent):
    """
    Composite node - represents a bracket containing multiple rounds
    """

    def __init__(self, bracket_name: str):
        self.bracket_name = bracket_name
        self.rounds: List[Round] = []

    def add_round(self, round: Round):
        """Add a round to this bracket"""
        self.rounds.append(round)

    def is_complete(self) -> bool:
        """A bracket is complete when ALL its rounds are complete"""
        if not self.rounds:
            return False
        return all(round.is_complete() for round in self.rounds)

    def get_all_matches(self) -> List[Match]:
        """Get all matches from all rounds"""
        all_matches = []
        for round in self.rounds:
            all_matches.extend(round.get_all_matches())
        return all_matches

    def get_status(self) -> str:
        if not self.rounds:
            return "EMPTY"
        elif self.is_complete():
            return "COMPLETED"
        elif any(
            round.get_status() in ["IN_PROGRESS", "READY"] for round in self.rounds
        ):
            return "IN_PROGRESS"
        else:
            return "PENDING"

    def get_current_round(self) -> Round:
        """Get the currently active round"""
        for round in self.rounds:
            if not round.is_complete():
                return round
        return None

    def display(self, indent: int = 0) -> str:
        spaces = "  " * indent
        result = f"{spaces}=== {self.bracket_name} [{self.get_status()}] ===\n"
        for round in self.rounds:
            result += round.display(indent + 1) + "\n"
        return result.rstrip()


class Tournament(BracketComponent):
    """
    Root composite - represents the entire tournament
    """

    def __init__(self, tournament_id: str, tournament_name: str):
        self.tournament_id = tournament_id
        self.tournament_name = tournament_name
        self.brackets: List[Bracket] = []
        self.phase = "REGISTRATION"  # REGISTRATION, CHECK_IN, ACTIVE, COMPLETED

    def add_bracket(self, bracket: Bracket):
        """Add a bracket to this tournament"""
        self.brackets.append(bracket)

    def is_complete(self) -> bool:
        """A tournament is complete when ALL its brackets are complete"""
        if not self.brackets or self.phase != "ACTIVE":
            return False
        return all(bracket.is_complete() for bracket in self.brackets)

    def get_all_matches(self) -> List[Match]:
        """Get all matches from all brackets"""
        all_matches = []
        for bracket in self.brackets:
            all_matches.extend(bracket.get_all_matches())
        return all_matches

    def get_status(self) -> str:
        if self.phase == "COMPLETED":
            return "COMPLETED"
        elif self.phase == "ACTIVE":
            return "IN_PROGRESS"
        else:
            return self.phase

    def get_match_count(self) -> int:
        """Get total number of matches"""
        return len(self.get_all_matches())

    def get_completed_match_count(self) -> int:
        """Get number of completed matches"""
        return sum(1 for match in self.get_all_matches() if match.is_complete())

    def get_progress_percentage(self) -> float:
        """Get tournament completion percentage"""
        total = self.get_match_count()
        if total == 0:
            return 0.0
        completed = self.get_completed_match_count()
        return (completed / total) * 100

    def display(self, indent: int = 0) -> str:
        result = f"{'='*60}\n"
        result += f"TOURNAMENT: {self.tournament_name}\n"
        result += f"Phase: {self.phase}\n"
        result += (
            f"Progress: {self.get_completed_match_count()}/{self.get_match_count()} "
        )
        result += f"({self.get_progress_percentage():.1f}%)\n"
        result += f"{'='*60}\n\n"

        for bracket in self.brackets:
            result += bracket.display(indent) + "\n\n"

        return result.rstrip()


def generate_bracket_order(n):
    """
    Generate the correct spatial ordering for tournament bracket matches.

    Args:
        n: Number of matches (must be a power of 2)

    Returns:
        List of indices representing the correct bracket order

    Example:
        For n=4: returns [0, 3, 1, 2]
        For n=8: returns [0, 7, 3, 4, 1, 6, 2, 5]
    """
    if n == 1:
        return [0]

    # Get order for half the size (recursive)
    sub_order = generate_bracket_order(n // 2)

    result = []
    for idx in sub_order:
        # Add the index from first half
        result.append(idx)
        # Add its mirror from second half
        result.append(n - 1 - idx)

    return result


def rearrange_bracket_pairs(pairs):
    """
    Rearrange tournament pairs into correct bracket spatial positions.

    Args:
        pairs: List of match pairs, e.g., [['player1', 'player8'], ...]

    Returns:
        Rearranged list where adjacent pairs feed into same next-round match

    Example:
        Input:  [['p1', 'p8'], ['p2', 'p7'], ['p3', 'p6'], ['p4', 'p5']]
        Output: [['p1', 'p8'], ['p4', 'p5'], ['p2', 'p7'], ['p3', 'p6']]
    """
    n = len(pairs)
    order = generate_bracket_order(n)

    # Rearrange pairs according to the order
    return [pairs[i] for i in order]


class BracketBuilder:
    """
    Helper class to build brackets with automatic linking
    """

    @staticmethod
    def link_sequential_rounds(current_round: Round, next_round: Round):
        """
        Link matches from current round to next round sequentially.
        Every 2 matches in current round feed into 1 match in next round.

        Example:
            Current Round: [M1, M2, M3, M4]
            Next Round: [M5, M6]
            Links: M1 & M2 → M5, M3 & M4 → M6
        """
        current_matches = current_round.matches
        next_matches = next_round.matches

        if len(current_matches) != len(next_matches) * 2:
            raise ValueError(
                f"Current round must have exactly 2x matches of next round. "
                f"Got {len(current_matches)} and {len(next_matches)}"
            )

        for i, next_match in enumerate(next_matches):
            # Two matches from current round feed into one in next round
            match1 = current_matches[i * 2]
            match2 = current_matches[i * 2 + 1]

            match1.set_next_match(next_match, slot=1)
            match2.set_next_match(next_match, slot=2)

    @staticmethod
    def link_losers_drop(winners_matches: List[Match], losers_matches: List[Match]):
        """
        Link winners bracket matches to losers bracket (where losers drop to).

        Args:
            winners_matches: List of matches from winners bracket
            losers_matches: List of matches in losers bracket to receive losers
        """
        if len(winners_matches) != len(losers_matches) * 2:
            raise ValueError(
                f"Winners matches must be 2x losers matches. "
                f"Got {len(winners_matches)} winners and {len(losers_matches)} losers"
            )

        for i, loser_match in enumerate(losers_matches):
            # Two winners matches drop to one losers match
            winners_match1 = winners_matches[i * 2]
            winners_match2 = winners_matches[i * 2 + 1]

            winners_match1.set_loser_destination(loser_match, slot=1)
            winners_match2.set_loser_destination(loser_match, slot=2)

    @staticmethod
    def link_losers_to_losers(
        losers_round1: Round, losers_round2: Round, winners_round_losers: List[Match]
    ):
        """
        Link losers bracket round where winners from previous losers round
        meet losers dropping from winners bracket.

        Pattern: LR1 winners (slot 1) vs WR losers (slot 2)
        """
        lr1_matches = losers_round1.matches
        lr2_matches = losers_round2.matches

        if len(lr1_matches) != len(winners_round_losers):
            raise ValueError("LR1 winners must equal number of WR losers")

        for i, lr2_match in enumerate(lr2_matches):
            # Winners from LR1 go to slot 1
            lr1_matches[i].set_next_match(lr2_match, slot=1)
            # Losers from WR go to slot 2
            winners_round_losers[i].set_loser_destination(lr2_match, slot=2)


# ============ SIMPLIFIED BRACKET BUILDING ============


def build_8_player_double_elimination_v2():
    """
    Build bracket using the BracketBuilder helper for cleaner code
    """
    tournament = Tournament("T002", "8-Player DE (Simplified Build)")

    # === CREATE ALL MATCHES ===
    # Winners Bracket
    w1, w2, w3, w4 = (
        Match("W1", "P1", "P8"),
        Match("W2", "P4", "P5"),
        Match("W3", "P2", "P7"),
        Match("W4", "P3", "P6"),
    )
    w5, w6 = Match("W5"), Match("W6")
    w7 = Match("W7")

    # Losers Bracket
    l1, l2 = Match("L1"), Match("L2")
    l3, l4 = Match("L3"), Match("L4")
    l5 = Match("L5")

    # Grand Finals
    gf = Match("GF")

    # === CREATE ROUNDS ===
    wr1 = Round(1, "WR1")
    for m in [w1, w2, w3, w4]:
        wr1.add_match(m)

    wr2 = Round(2, "WR2")
    for m in [w5, w6]:
        wr2.add_match(m)

    wr3 = Round(3, "WR3")
    wr3.add_match(w7)

    lr1 = Round(1, "LR1")
    for m in [l1, l2]:
        lr1.add_match(m)

    lr2 = Round(2, "LR2")
    for m in [l3, l4]:
        lr2.add_match(m)

    lr3 = Round(3, "LR3")
    lr3.add_match(l5)

    gf_round = Round(1, "GF")
    gf_round.add_match(gf)

    # === USE BRACKET BUILDER TO LINK ===
    builder = BracketBuilder()

    # Link Winners Bracket progression
    builder.link_sequential_rounds(wr1, wr2)  # WR1 → WR2
    builder.link_sequential_rounds(wr2, wr3)  # WR2 → WR3

    # Link WR1 losers to LR1
    builder.link_losers_drop(wr1.matches, lr1.matches)

    # Link LR1 winners + WR2 losers → LR2
    builder.link_losers_to_losers(lr1, lr2, wr2.matches)

    # Link LR2 → LR3
    builder.link_sequential_rounds(lr2, lr3)

    # Link to Grand Finals
    w7.set_next_match(gf, slot=1)
    l5.set_next_match(gf, slot=2)

    # === ASSEMBLE TOURNAMENT ===
    wb = Bracket("Winners")
    wb.add_round(wr1)
    wb.add_round(wr2)
    wb.add_round(wr3)

    lb = Bracket("Losers")
    lb.add_round(lr1)
    lb.add_round(lr2)
    lb.add_round(lr3)

    gfb = Bracket("Grand Finals")
    gfb.add_round(gf_round)

    tournament.add_bracket(wb)
    tournament.add_bracket(lb)
    tournament.add_bracket(gfb)
    tournament.phase = "ACTIVE"

    return tournament


def build_8_player_double_elimination():
    """
    Build a complete 8-player double elimination bracket with proper linking
    """
    tournament = Tournament("T001", "8-Player Double Elimination")

    # === WINNERS BRACKET ===
    winners_bracket = Bracket("Winners Bracket")

    # Winners Round 1 (4 matches)
    wr1 = Round(1, "Winners Round 1")
    w1 = Match("W1", "Player1", "Player8")
    w2 = Match("W2", "Player4", "Player5")
    w3 = Match("W3", "Player2", "Player7")
    w4 = Match("W4", "Player3", "Player6")
    wr1.add_match(w1)
    wr1.add_match(w2)
    wr1.add_match(w3)
    wr1.add_match(w4)

    # Winners Round 2 (2 matches)
    wr2 = Round(2, "Winners Semifinals")
    w5 = Match("W5")  # Winner of W1 vs Winner of W2
    w6 = Match("W6")  # Winner of W3 vs Winner of W4
    wr2.add_match(w5)
    wr2.add_match(w6)

    # Winners Finals
    wr3 = Round(3, "Winners Finals")
    w7 = Match("W7")  # Winner of W5 vs Winner of W6
    wr3.add_match(w7)

    winners_bracket.add_round(wr1)
    winners_bracket.add_round(wr2)
    winners_bracket.add_round(wr3)

    # === LOSERS BRACKET ===
    losers_bracket = Bracket("Losers Bracket")

    # Losers Round 1 (2 matches) - receives losers from WR1
    lr1 = Round(1, "Losers Round 1")
    l1 = Match("L1")  # Loser of W1 vs Loser of W2
    l2 = Match("L2")  # Loser of W3 vs Loser of W4
    lr1.add_match(l1)
    lr1.add_match(l2)

    # Losers Round 2 (2 matches) - LR1 winners vs WR2 losers
    lr2 = Round(2, "Losers Round 2")
    l3 = Match("L3")  # Winner of L1 vs Loser of W5
    l4 = Match("L4")  # Winner of L2 vs Loser of W6
    lr2.add_match(l3)
    lr2.add_match(l4)

    # Losers Finals
    lr3 = Round(3, "Losers Finals")
    l5 = Match("L5")  # Winner of L3 vs Winner of L4
    lr3.add_match(l5)

    losers_bracket.add_round(lr1)
    losers_bracket.add_round(lr2)
    losers_bracket.add_round(lr3)

    # === GRAND FINALS ===
    gf_bracket = Bracket("Grand Finals")
    gf_round = Round(1, "Grand Finals")
    gf = Match("GF")  # Winner of W7 vs Winner of L5
    gf_round.add_match(gf)
    gf_bracket.add_round(gf_round)

    # === LINK WINNERS BRACKET ===
    # WR1 winners advance to WR2
    w1.set_next_match(w5, slot=1)
    w2.set_next_match(w5, slot=2)
    w3.set_next_match(w6, slot=1)
    w4.set_next_match(w6, slot=2)

    # WR1 losers drop to LR1
    w1.set_loser_destination(l1, slot=1)
    w2.set_loser_destination(l1, slot=2)
    w3.set_loser_destination(l2, slot=1)
    w4.set_loser_destination(l2, slot=2)

    # WR2 winners advance to WR3
    w5.set_next_match(w7, slot=1)
    w6.set_next_match(w7, slot=2)

    # WR2 losers drop to LR2
    w5.set_loser_destination(l3, slot=2)
    w6.set_loser_destination(l4, slot=2)

    # WR3 winner advances to Grand Finals
    w7.set_next_match(gf, slot=1)

    # === LINK LOSERS BRACKET ===
    # LR1 winners advance to LR2
    l1.set_next_match(l3, slot=1)
    l2.set_next_match(l4, slot=1)

    # LR2 winners advance to LR3
    l3.set_next_match(l5, slot=1)
    l4.set_next_match(l5, slot=2)

    # LR3 winner advances to Grand Finals
    l5.set_next_match(gf, slot=2)

    # === ADD TO TOURNAMENT ===
    tournament.add_bracket(winners_bracket)
    tournament.add_bracket(losers_bracket)
    tournament.add_bracket(gf_bracket)
    tournament.phase = "ACTIVE"

    return tournament


# ============ DEMONSTRATION ============

print("=" * 70)
print("BUILDING 8-PLAYER DOUBLE ELIMINATION BRACKET")
print("=" * 70)
print()

tournament = build_8_player_double_elimination()
print(tournament.display())

print("\n" + "=" * 70)
print("SIMULATING MATCH RESULTS")
print("=" * 70)
print()

# Simulate Winners Round 1
print("Setting Winners Round 1 results...")
wb = tournament.brackets[0]  # Winners bracket
wr1_matches = wb.rounds[0].matches

wr1_matches[0].set_result("Player1", "2-0")  # W1
wr1_matches[1].set_result("Player4", "2-1")  # W2
wr1_matches[2].set_result("Player2", "2-0")  # W3
wr1_matches[3].set_result("Player3", "2-1")  # W4

print(f"\nWinners Round 1 complete: {wb.rounds[0].is_complete()}")
print(f"Tournament progress: {tournament.get_progress_percentage():.1f}%")

print("\n" + "-" * 70)
print(tournament.display())

# Simulate Winners Round 2
print("\n" + "=" * 70)
print("Setting Winners Round 2 results...")
print("=" * 70)
wr2_matches = wb.rounds[1].matches

wr2_matches[0].set_result("Player1", "2-1")  # W5: Player1 vs Player4
wr2_matches[1].set_result("Player2", "2-0")  # W6: Player2 vs Player3

print(f"\nWinners Round 2 complete: {wb.rounds[1].is_complete()}")
print(f"Tournament progress: {tournament.get_progress_percentage():.1f}%")

print("\n" + "-" * 70)
print(tournament.display())

# Simulate Losers Round 1
print("\n" + "=" * 70)
print("Setting Losers Round 1 results...")
print("=" * 70)
lb = tournament.brackets[1]  # Losers bracket
lr1_matches = lb.rounds[0].matches

lr1_matches[0].set_result("Player8", "2-1")  # L1: Player8 vs Player5
lr1_matches[1].set_result("Player6", "2-0")  # L2: Player7 vs Player6

print(f"\nLosers Round 1 complete: {lb.rounds[0].is_complete()}")
print(f"Tournament progress: {tournament.get_progress_percentage():.1f}%")

print("\n" + "-" * 70)
print(tournament.display())
