CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_first_name TEXT NOT NULL,
    user_last_name TEXT,
    user_name TEXT NOT NULL,
    user_password TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    verified BOOLEAN NOT NULL,
    created TIMESTAMP DEFAULT now() NOT NULL,
    modified TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_caption TEXT,
    media_location TEXT,
    created TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE media_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    media_id INTEGER REFERENCES media(id) ON DELETE CASCADE
);
