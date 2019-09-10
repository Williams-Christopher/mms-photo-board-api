-- Insert to 'users'
INSERT INTO users
    (user_first_name, user_last_name, user_name, user_password, user_phone, verified, created, modified)
VALUES
('Malcolm', 'Reynolds', 'mal', '$2a$12$bTG.wKghYb5Kgqs.HvQ.EeHj1bddrJzc5Gyf7gZ1ECjm7/WbATPnG', '$2a$12$n/.T/tytu2uEQV587gBhIeTe3v2YrJrgE9J/JRAxfUDIiuvOrqkk.', FALSE, now() - INTERVAL '1 day', now()), --browncoats1, +17894561234
('Hoban', 'Washburne', 'wash', '$2a$12$Ek06HjKIoKksozEpGbOTDukPut8BgNUyZbKBHQVySNLDhzJKgF62y', '$2a$12$FjVnFZf1bOFei07.w0TmuO85ORpJXJVvyBoONk9FRORSn.avFyzoW', TRUE, now() - INTERVAL '2 day', now() - INTERVAL '1 day'), --pilot007, +15551234567
('Kaylee', 'Fry', 'kbug', '$2a$12$Pq93uuWISkUxJcSYUXgp4uKPCIydDWY5GhocYU7vxKJClHRRqTvj6', '$2a$12$SG8769QG7uz.d33WXeTjzOKIAo9enO/bbd/cPpmidb17Lr9u8JC8a', FALSE, now(), now()), --shiny01, +15557654321
('Jayne', 'Cobb', 'hero', '$2a$12$W0JoILpsXTQaSeAT.16fvOXipR1u21wNHeCRr089clikTeZV0QHCu', '$2a$12$rqui.zjPmRKQCnrRBlRZ1u1aQ3hXjeS5KJg/kiDnOfShADmmOq336', TRUE, now(), now()), --ofcanton, +11234567890
('River', 'Tamm', 'rtamm', '$2a$12$xuryBOWt4txrSypWbvwRye6M/3XVnJNLqmtqIvcmmjv8iIaKQTnjK', '$2a$12$Tbvd1h7TGdtgb2OsKAN7cOCQJvDNOBanz9aDASzx5y1xFuTpnkuua', FALSE, now(), now()) --voices, +11234567890
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
