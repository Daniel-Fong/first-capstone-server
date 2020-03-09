CREATE TABLE games (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    notes TEXT,
    date_modified TIMESTAMPTZ DEFAULT now() NOT NULL
)