-- Create db
CREATE DATABASE planner;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    google_id VARCHAR NOT NULL UNIQUE
);

CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    board_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    author_id INT references users(id) NOT NULL
);

CREATE TABLE panels (
    id SERIAL PRIMARY KEY,
    panel_name VARCHAR(255) NOT NULL,
    board_id INT references boards(id) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    status INT NOT NULL,
    panel_id INT references panels(id) NOT NULL
);

-- Submit new post
INSERT INTO posts (body, author_id) VALUES ($1, $2);

-- Get feed
SELECT u.username, u.img, p.body FROM users u 
INNER JOIN posts p ON u.id = p.author_id 
ORDER BY p.id DESC LIMIT 5 OFFSET {min}

-- Get my posts
SELECT u.username, u.img, p.body FROM users u 
INNER JOIN posts p ON u.id = p.author_id 
WHERE p.author_id = u.id 
ORDER BY p.id DESC LIMIT 5 OFFSET {min}