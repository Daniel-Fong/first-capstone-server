CREATE TABLE players (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    userid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    notes TEXT
)