from uuid import UUID

# "PENDING" | "ONGOING" | "COMPLETED"


class ToMatch:
    def __init__(self, match_id, match_slot):
        self.match_id = match_id
        self.match_slot = match_slot


class Match:
    def __init__(self, tournament_id, winner_to_match_id, winner_to_match_slot):
        self.id = UUID()
        self.tournament_id = tournament_id
        self.player1_id = None
        self.player2_id = None
        self.status = "PENDING"
        self.winner_to_match = ToMatch(winner_to_match_id, winner_to_match_slot)
