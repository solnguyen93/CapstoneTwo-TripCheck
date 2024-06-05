-- Connect to a different database
\connect template1;

-- Drop database if it exists
DROP DATABASE IF EXISTS mydatabase;

-- Create database
CREATE DATABASE mydatabase;

-- Drop the test database if it exists
DROP DATABASE IF EXISTS mydatabase_test;

-- Create the test database
CREATE DATABASE mydatabase_test;

-- Connect to database
\connect mydatabase;

-- Apply the schema to the test database
\i schema.sql;

-- Insert seed data into the test database
\i seed.sql;


