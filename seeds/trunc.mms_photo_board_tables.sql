TRUNCATE TABLE
    media_likes,
    media,
    users
    --select setval('users_id_seq', 0);
    RESTART IDENTITY CASCADE;
