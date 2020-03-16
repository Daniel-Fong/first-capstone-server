BEGIN;

TRUNCATE
    users,
    games,
    players,
    players_in_games,
    RESTART IDENTITY CASCADE;

INSERT INTO users (id, name, password, admin)
VALUES
    (1, 'daniel', '$2a$12$jcsmpgGgh4oFP6DUZiOQY.QV6.8l2JrYkK94l5lp2d57eewjE/Bca', true),
    (2, 'alfonso', '$2a$12$r7OLxOxfzVT9GWopEC06a.V6t7f/Hwln3OESfKIBTXvL8CpX4a2lK', false),
    (3, 'jimmy.john', '$2a$12$vgcZ..fHnKY1MppZoBj4feGTFgioTDGdPgpwMLN5g/kc38L2/QQoi', false);

INSERT INTO games (id, name, notes, userid)
VALUES
    (1, 'Catan', 'some notes', 1),
    (2, 'Oh heck', 'lotta notes', 1),
    (3, 'Clank', 'important notes', 2),
    (4, '7 Wonders', 'such notes', 2),
    (5, 'Bingo', 'much notes', 1),
    (6, 'my only game', 'wow', 3);

INSERT INTO players (id, userid, name, notes)
VALUES
    (1, 1, 'daniel', 'Such score'),
    (2, 1, 'jenny', 'Much wow'),
    (3, 2, 'whozit', 'Solo oh noes'),
    (4, 3, 'willie', 'Trice is nice'),
    (5, 3, 'marcus', 'I am very good at games'),
    (6, 3, 'olga', 'Such score'),
    (7, 1, 'fabian', 'just the two of us'),
    (8, 2, 'hugo', 'but still fun'),
    (9, 3, 'christian', 'im winning');

INSERT INTO scores (id, playerid, gameid, score, note)
VALUES 
    (14, 1, 1, 17, 'Sheep galore'),
    (2, 1, 1, 15, 'this score does not make sense for catan'),
    (3, 1, 2, 5, 'not going well'),
    (4, 2, 1, 7, 'losing badly'),
    (5, 2, 1, 7, 'losing badly'),
    (6, 2, 2, 90, 'destroying daniel'),
    (7, 2, 2, 90, 'destroying daniel'),
    (8, 7, 1, 8, 'dont like catan'),
    (9, 3, 3, 100, 'got lots of clank treasures'),
    (10, 3, 4, 35, 'wonderful'),
    (11, 8, 4, 17, 'kewl'),
    (12, 8, 4, 17, 'kewl'),
    (13, 8, 4, 17, 'kewl');

INSERT INTO players_in_game (id, playerid, gameid)
VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 5),
    (4, 2, 1),
    (5, 2, 2),
    (6, 2, 5),
    (8, 7, 2),
    (9, 7, 5);

COMMIT;