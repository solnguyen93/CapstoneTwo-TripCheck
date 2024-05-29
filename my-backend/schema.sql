-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Create Checklists Table
CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    trip_destination VARCHAR(255),
    trip_from_date DATE,
    trip_to_date DATE
);

-- Create User_Checklist Table
CREATE TABLE user_checklists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    checklist_id INTEGER REFERENCES checklists(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL
);

-- Create Items Table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER REFERENCES checklists(id) ON DELETE CASCADE,
    parent_item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
    name VARCHAR(255),
    position INT,
    is_checked BOOLEAN NOT NULL DEFAULT FALSE
);