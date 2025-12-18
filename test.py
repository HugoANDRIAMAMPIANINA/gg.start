from math import floor


TOTAL_PLAYERS = 14


class Player:
    def __init__(self, name):
        self._name = name

    def get_name(self) -> str:
        return self._name


class Match:
    def __init__(self, p1, p2):
        self._p1 = p1
        self._p2 = p2
        self._p1_score = None
        self._p2_score = None

    def get_p1_score(self) -> int:
        return self._p1_score

    def set_p1_score(self, score):
        self._p1_score = score

    def get_p2_score(self) -> int:
        return self._p2_score

    def set_p2_score(self, score):
        self._p2_score = score

    def get_winner(self):
        if self._p1_score > self._p2_score:
            return self._p1
        elif self._p1_score < self._p2_score:
            return self._p2
        return None

    def __str__(self) -> str:
        return f"{self._p1} - {self._p2}"


def generate_bracket_order(players_count):
    if players_count == 1:
        return [0]

    # Get order for half the size (recursive)
    sub_order = generate_bracket_order(players_count // 2)

    result = []
    for match_index in sub_order:
        # Add the index from first half
        result.append(match_index)
        # Add its mirror from second half
        result.append(players_count - 1 - match_index)

    return result


def order_round(round):
    order = generate_bracket_order(len(round))
    ordered_round = []
    for i in order:
        ordered_round.append(round[i])
    return ordered_round


def main():
    players = [f"player{i+1}" for i in range(TOTAL_PLAYERS)]
    print(players)

    players_count = len(players)

    nearest_power_of_two = 2
    winner_round_count = 1
    while nearest_power_of_two < players_count:
        nearest_power_of_two *= 2
        winner_round_count += 1

    print(nearest_power_of_two)
    print(winner_round_count)

    current_round_players = players

    next_round_players = []

    has_byes = False
    if players_count != nearest_power_of_two:
        has_byes = True
        byes_count = nearest_power_of_two - players_count
        for _ in range(byes_count):
            current_round_players.append("")

        next_round_players_count = len(current_round_players) / 2

        next_round_players = players[:byes_count]
        while len(next_round_players) < next_round_players_count:
            next_round_players.append("")

        next_round_players = order_round(next_round_players)
        print(next_round_players)
        # players = players[byes_count:]
        # print(next_round_players)
        # print(players)

    bracket = {}

    for round_number in range(winner_round_count):
        if round_number != 0:
            next_round_players = []
        print(f"Round {round_number+1}")

        round_id = f"R{round_number+1}"
        bracket[round_id] = {}

        round_players_count = len(current_round_players)
        round_match_count = int(round_players_count / 2)
        print(f"Nombre de matchs du round: {round_match_count}")
        round = []
        for i in range(round_match_count):
            match = Match(
                current_round_players[i],
                current_round_players[-1 - i],
            )
            round.append(match)

            if current_round_players[-1 - i] == "":
                next_round_players.append(current_round_players[i])
            else:
                next_round_players[next_round_players.index("")] = f"{round_id}W{i+1}"

        current_round_players = next_round_players

        if round_number == 0:
            round = order_round(round)

        for index, match in enumerate(round):
            bracket[round_id][index + 1] = match
            print(match)

    print(bracket)


if __name__ == "__main__":
    main()
    # order = generate_bracket_order(TOTAL_PLAYERS)
    # print(order)
