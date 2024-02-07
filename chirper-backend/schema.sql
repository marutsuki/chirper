
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
);

CREATE TABLE chirps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    text_content TEXT,
    created_at TIMESTAMP
);

CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    bio TEXT,
    avatar_url TEXT
);

CREATE TABLE follows (
    follower_id INTEGER,
    followee_id INTEGER,
    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followee_id) REFERENCES users(id)
);