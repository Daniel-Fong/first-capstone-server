BEGIN;

TRUNCATE
    users,
    games,
    players
    RESTART IDENTITY CASCADE;

INSERT INTO users (name, password, admin)
VALUES
    ('daniel', 'password', true),
    ('alfonso', 'pw', false),
    ('jimmy.john', 'sandwich', false);

INSERT INTO games (notes, userid)
VALUES
    ('Heck of a game', 1),
    ('Heck me this game', 1),
    ('Hecking game', 2),
    ('Wow', 2),
    ('Much game', 1),
    ('Such a game', 3);

INSERT INTO players (gameid, notes)
VALUES
    (1, 'Such score'),
    (1, 'Much wow'),
    (2, 'Solo oh noes'),
    (3, 'Trice is nice'),
    (3, 'Ooooweeee'),
    (3, 'Such score'),
    (4, 'just the two of us'),
    (4, 'but still fun'),
    (5, 'im winning'),
    (6, '4 people perfect'),
    (6, 'great board game group'),
    (6, 'Such score'),
    (5, 'no i am'),
    (6, 'Such score');

COMMIT;