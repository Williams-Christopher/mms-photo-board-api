-- Insert to 'users'
INSERT INTO users
    (user_first_name, user_last_name, user_name, user_password, user_phone, verified, created, modified)
VALUES
('Malcolm', 'Reynolds', 'mal', 'browncoats1', '512-801-8722', FALSE, now() - INTERVAL '1 day', now()),
('Hoban', 'Washburne', 'wash', 'pilot007', '555-123-4567', TRUE, now() - INTERVAL '2 day', now() - INTERVAL '1 day'),
('Kaylee', 'Fry', 'kbug', 'shiny01', '555-765-4321', FALSE, now(), now()),
('Jayne', 'Cobb', 'hero', 'ofcanton', '123-456-7890', TRUE, now(), now()),
('River', 'Tamm', 'rtamm', 'voices', '123-456-7890', FALSE, now(), now())
;

-- Insert to 'media'
INSERT INTO media
    (user_id, media_url, media_caption, media_location, created)
VALUES
(1, 'https://picsum.photos/1027/768', '#Payday', 'Serenity', now()),
(2, 'https://picsum.photos/1027/768', 'Piloting is the best waya to see the verse', 'Serenity', now()-INTERVAL'1 day'),
(3, 'https://picsum.photos/4032/3024', 'Shiny!', 'Canton', now()-INTERVAL'1 day'),
(4, 'https://picsum.photos/4032/3024', 'The Reverend says my soul is safe', 'Taylor', now()-INTERVAL'2 day'),
(5, 'https://picsum.photos/3264/2448', 'Reaver free since 93', 'The Verse', now()-INTERVAL'2 day'),
(4, 'https://picsum.photos/1027/768', 'The cargo bay is my home', 'Serenity', now()-INTERVAL'3 day'),
(3, 'https://picsum.photos/2048/1024', 'I dont know whats happening', 'Serenity', now()-INTERVAL'3 day'),
(4, 'https://loremflickr.com/750/300/landscape?random=10', 'So cool! I just got a dog!', 'Somewhere', now()-INTERVAL'4 day')
;

-- Insert to 'media_likes'
INSERT INTO media_likes
    (user_id, media_id)
VALUES
    (1, 1),
    (2, 4), 
    (3, 2), 
    (4, 6),
    (5, 5),
    (2, 6),
    (5, 4),
    (3, 5),
    (5, 6),
    (4, 5),
    (4, 1),
    (1, 6),
    (2, 3),
    (2, 1),
    (5, 1),
    (5, 2)
;
