CREATE TABLE players_in_game (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    playerid INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    gameid INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE
)