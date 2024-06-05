-- Insert test user
INSERT INTO users (username, password, name, email)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'JohnDoe',
        'john@johndoe.com');

-- Insert checklist for trip packing
INSERT INTO checklists (title, description, trip_destination, trip_from_date, trip_to_date)
VALUES ('Japan 2024', 'Checklist for packing essentials for a trip', 'Tokyo', '2024-06-01', '2024-06-07');

-- Associate test user with the trip packing checklist
INSERT INTO user_checklists (user_id, checklist_id, role)
VALUES (1, 1, 'owner');

-- Insert items for trip packing checklist
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES 
    (1, NULL, 'Suitcase', FALSE, 0),
    (1, 1, 'Bag', FALSE, 0),
    (1, 2, 'Toiletries', FALSE, 0),
    (1, 2, 'Medications', FALSE, 1),
    (1, NULL, 'Backpack', FALSE, 1),
    (1, 5, 'Passport', FALSE, 0),
    (1, 4, 'Advil', FALSE, 0),
    (1, 5, 'Phone', FALSE, 1),
    (1, 2, 'Sunscreen', FALSE, 2),
    (1, 2, 'lotion', FALSE, 3),
    (1, 1, 'Swimsuit', FALSE, 1),
    (1, 1, 'Flip Flops', FALSE, 2),
    (1, 1, 'Beach Towel', FALSE, 3);

-- Insert additional checklists
INSERT INTO checklists (title, description, trip_destination, trip_from_date, trip_to_date)
VALUES 
    ('Mountain Hiking Checklist', 'Checklist for essentials needed for a mountain hiking trip', 'Mountains', '2024-07-15', '2024-07-15'),
    ('City Exploration Checklist', 'Checklist for exploring a city', 'City', NULL, NULL),
    ('Trip Packing Checklist', 'Checklist for essentials needed for a trip to Japan', 'Japan', '2024-09-01', '2024-09-10');

-- Associate test user with additional checklists
INSERT INTO user_checklists (user_id, checklist_id, role)
VALUES 
    (1, 2, 'owner'),
    (1, 3, 'owner'),
    (1, 4, 'owner');

-- Insert items for mountain hiking checklist
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES 
    (2, NULL, 'Backpack', FALSE, 0),
    (2, 11, 'Water Bottle', FALSE, 0),
    (2, 11, 'Snacks', FALSE, 1),
    (2, 11, 'Map', FALSE, 2),
    (2, 11, 'Compass', FALSE, 3),
    (2, 11, 'First Aid Kit', FALSE, 4);

-- Insert items for city exploration checklist
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES 
    (3, NULL, 'Daypack', FALSE, 0),
    (3, 17, 'Camera', FALSE, 0),
    (3, 17, 'Guidebook', FALSE, 1),
    (3, 17, 'Comfortable Shoes', FALSE, 2),
    (3, 17, 'Money/Travel Card', FALSE, 3),
    (3, 17, 'Umbrella', FALSE, 4);

-- Insert items for Japan travel checklist
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES 
    (4, NULL, 'Passport', FALSE, 0),
    (4, NULL, 'Visa (if required)', FALSE, 1),
    (4, NULL, 'Travel Itinerary', FALSE, 2),
    (4, NULL, 'Currency', FALSE, 3),
    (4, NULL, 'Language Translator', FALSE, 4),
    (4, NULL, 'Travel Guidebook', FALSE, 5),
    (4, NULL, 'Electrical Adapter', FALSE, 6),
    (4, NULL, 'Portable Charger', FALSE, 7),
    (4, NULL, 'Medications', FALSE, 8),
    (4, NULL, 'Travel Insurance Documents', FALSE, 9);