-- Insert additional test users
INSERT INTO users (username, password, name, email)
VALUES 
    ('testuser', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'JohnDoe', 'john@johndoe.com'),
    ('testuser2', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'JaneDoe', 'jane@janedoe.com'),
    ('testuser3', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'AliceSmith', 'alice@alicesmith.com'),
    ('testuser4', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'BobJohnson', 'bob@bobjohnson.com');

-- Insert checklist
INSERT INTO checklists (title, description, trip_destination, trip_from_date, trip_to_date)
VALUES 
    ('Japan 2024', 'Checklist for packing essentials for a trip', 'Tokyo', '2024-06-01', '2024-06-07'),
    ('Mountain Hiking Checklist', 'Checklist for essentials needed for a mountain hiking trip', 'Mountains', '2024-07-15', '2024-07-15'),
    ('City Exploration Checklist', 'Checklist for exploring a city', 'City', NULL, NULL),
    ('Trip Packing Checklist', 'Checklist for essentials needed for a trip to Japan', 'Japan', '2024-09-01', '2024-09-10');

-- Associate test users with additional checklists
INSERT INTO user_checklists (user_id, checklist_id, role)
VALUES 
    (1, 1, 'owner'),
    (2, 2, 'owner'),
    (3, 3, 'owner'),
    (4, 4, 'owner'),
    (2, 1, 'shared'),
    (3, 2, 'shared');

-- Insert items for mountain hiking checklist
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
    (1, 2, 'Lotion', FALSE, 3),
    (1, 1, 'Swimsuit', FALSE, 1),
    (1, 1, 'Flip Flops', FALSE, 2),
    (1, 1, 'Beach Towel', FALSE, 3),
    (2, NULL, 'Backpack', FALSE, 0),
    (2, 14, 'Water Bottle', FALSE, 0),
    (2, 14, 'Snacks', FALSE, 1),
    (2, 14, 'Map', FALSE, 2),
    (2, 14, 'Compass', FALSE, 3),
    (2, 14, 'First Aid Kit', FALSE, 4),
    (3, NULL, 'Daypack', FALSE, 0),
    (3, 20, 'Camera', FALSE, 0),
    (3, 20, 'Guidebook', FALSE, 1),
    (3, 20, 'Comfortable Shoes', FALSE, 2),
    (3, 20, 'Money/Travel Card', FALSE, 3),
    (3, 20, 'Umbrella', FALSE, 4),
    (4, NULL, 'Passport', FALSE, 0),
    (4, NULL, 'Visa (if required)', FALSE, 1),
    (4, NULL, 'Travel Itinerary', FALSE, 2),
    (4, NULL, 'Currency', FALSE, 3),
    (4, NULL, 'Language Translator', FALSE, 4),
    (4, NULL, 'Travel Guidebook', FALSE, 5),
    (4, NULL, 'Electrical Adapter', FALSE, 6),
    (4, NULL, 'Portable Charger', FALSE, 7),
    (4, NULL, 'Medications', FALSE, 8),
    (4, NULL, 'Travel Insurance Documents', FALSE, 9),
    (1, NULL, 'Carry On', FALSE, 0),
    (1, 36, 'Paper Bag', FALSE, 0),
    (1, 37, 'Snacks', FALSE, 0),
    (1, 36, 'Blanket', FALSE, 0),
    (1, 38, 'Chips', FALSE, 0),
    (1, 38, 'Candy', FALSE, 0),
    (1, 37, 'Drinks', FALSE, 0),
    (1, 42, 'Juice', FALSE, 0),
    (1, 42, 'Water', FALSE, 0);