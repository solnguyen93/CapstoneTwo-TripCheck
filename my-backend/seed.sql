-- ============================================================
-- Users
-- testuser: id=1 (demo account)
-- admin:    id=2 (password: 'password')
-- sarah:    id=3 (password: 'password')
-- mike:     id=4 (password: 'password')
-- ============================================================

INSERT INTO users (username, password, name, email)
VALUES ('testuser',
        '$2b$12$7XY2y8CGoM2BUS4ePgwQSO4rwXAvc7BC4X0v0Fk.h52O7N3XuY0Ki',
        'John Doe',
        'john@johndoe.com');

INSERT INTO users (username, password, name, email, is_admin)
VALUES ('admin',
        '$2b$12$7XY2y8CGoM2BUS4ePgwQSO4rwXAvc7BC4X0v0Fk.h52O7N3XuY0Ki',
        'Admin',
        'admin@vigilkura.com',
        TRUE);

INSERT INTO users (username, password, name, email)
VALUES ('sarah',
        '$2b$12$7XY2y8CGoM2BUS4ePgwQSO4rwXAvc7BC4X0v0Fk.h52O7N3XuY0Ki',
        'Sarah Kim',
        'sarah@email.com');

INSERT INTO users (username, password, name, email)
VALUES ('mike',
        '$2b$12$7XY2y8CGoM2BUS4ePgwQSO4rwXAvc7BC4X0v0Fk.h52O7N3XuY0Ki',
        'Mike Johnson',
        'mike@email.com');

-- ============================================================
-- Checklists
-- 1: Japan Family Trip     (testuser, past, shared with sarah)
-- 2: Mountain Hiking       (testuser, future)
-- 3: NYC City Break        (testuser, no dates)
-- 4: Business Conference   (sarah, future, shared with testuser)
-- 5: Weekend Camping       (mike, past, all completed)
-- 6: Europe Backpacking    (sarah, future)
-- ============================================================

INSERT INTO checklists (title, description, trip_destination, trip_from_date, trip_to_date)
VALUES
    ('Japan Family Trip 2024', 'Family trip to Japan with the kids',             'Tokyo, Japan',   '2024-06-01', '2024-06-14'),
    ('Mountain Hiking',        'Summer hiking trip in the Rockies',              'Colorado, USA',  '2025-08-10', '2025-08-17'),
    ('NYC City Break',         'Long weekend exploring New York City',            'New York, USA',  NULL,         NULL),
    ('Business Conference',    'Annual tech conference in Chicago',               'Chicago, USA',   '2025-05-20', '2025-05-23'),
    ('Weekend Camping',        'Camping trip at Yosemite - completed!',           'Yosemite, USA',  '2024-03-15', '2024-03-17'),
    ('Europe Backpacking',     'Backpacking across Western Europe',               'Europe',         '2025-07-01', '2025-07-30');

-- ============================================================
-- Ownership & sharing
-- ============================================================

INSERT INTO user_checklists (user_id, checklist_id, role)
VALUES
    (1, 1, 'owner'),
    (1, 2, 'owner'),
    (1, 3, 'owner'),
    (3, 4, 'owner'),
    (4, 5, 'owner'),
    (3, 6, 'owner'),
    (3, 1, 'shared'),
    (1, 4, 'shared');

-- ============================================================
-- Checklist 1: Japan Family Trip
-- 4-level deep nesting — multiple suitcases, bags inside bags,
-- items inside bags. Realistic family of 4 packing scenario.
-- Mixed checked/unchecked (in progress)
--
-- Level 1 ids: 1-5
-- Level 2 ids: 6-21
-- Level 3 ids: 22-70
-- Level 4 ids: 71-76
-- ============================================================

-- Level 1: Suitcases & bags (parent = null)
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (1, NULL, 'Dad''s Suitcase',          FALSE, 0),  -- id 1
    (1, NULL, 'Mom''s Suitcase',          FALSE, 1),  -- id 2
    (1, NULL, 'Kids'' Suitcase',          FALSE, 2),  -- id 3
    (1, NULL, 'Carry-on Backpack',        FALSE, 3),  -- id 4
    (1, NULL, 'Documents & Planning',     TRUE,  4);  -- id 5

-- Level 2: Bags inside suitcases
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    -- Dad's Suitcase (id 1)
    (1, 1, 'Clothes Bag',                 FALSE, 0),  -- id 6
    (1, 1, 'Toiletry Bag',                FALSE, 1),  -- id 7
    (1, 1, 'Shoes Bag',                   FALSE, 2),  -- id 8
    -- Mom's Suitcase (id 2)
    (1, 2, 'Clothes Bag',                 FALSE, 0),  -- id 9
    (1, 2, 'Toiletry Bag',                FALSE, 1),  -- id 10
    (1, 2, 'Shoes Bag',                   FALSE, 2),  -- id 11
    -- Kids' Suitcase (id 3)
    (1, 3, 'Emma''s Bag',                 FALSE, 0),  -- id 12
    (1, 3, 'Liam''s Bag',                 FALSE, 1),  -- id 13
    (1, 3, 'Kids'' Toiletry Bag',         FALSE, 2),  -- id 14
    -- Carry-on Backpack (id 4)
    (1, 4, 'Snacks & Entertainment',      FALSE, 0),  -- id 15
    (1, 4, 'Documents Pouch',             TRUE,  1),  -- id 16
    (1, 4, 'Emergency Kit',               FALSE, 2),  -- id 17
    -- Documents & Planning (id 5)
    (1, 5, 'Passports',                   TRUE,  0),  -- id 18
    (1, 5, 'Travel Insurance',            TRUE,  1),  -- id 19
    (1, 5, 'Hotel Bookings',              TRUE,  2),  -- id 20
    (1, 5, 'Flight Tickets',              TRUE,  3);  -- id 21

-- Level 3: Items inside bags
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    -- Dad's Clothes Bag (id 6)
    (1, 6, 'T-Shirts x3',                FALSE, 0),  -- id 22
    (1, 6, 'Jeans',                       FALSE, 1),  -- id 23
    (1, 6, 'Dress Shirt',                 FALSE, 2),  -- id 24
    (1, 6, 'Socks & Underwear',           FALSE, 3),  -- id 25
    -- Dad's Toiletry Bag (id 7)
    (1, 7, 'Toothbrush',                  FALSE, 0),  -- id 26
    (1, 7, 'Toothpaste',                  FALSE, 1),  -- id 27
    (1, 7, 'Shampoo',                     FALSE, 2),  -- id 28
    (1, 7, 'Razor',                       FALSE, 3),  -- id 29
    (1, 7, 'Deodorant',                   FALSE, 4),  -- id 30
    -- Dad's Shoes Bag (id 8)
    (1, 8, 'Sneakers',                    TRUE,  0),  -- id 31
    (1, 8, 'Sandals',                     FALSE, 1),  -- id 32
    -- Mom's Clothes Bag (id 9)
    (1, 9, 'Tops x3',                     FALSE, 0),  -- id 33
    (1, 9, 'Jeans',                       FALSE, 1),  -- id 34
    (1, 9, 'Dress',                       FALSE, 2),  -- id 35
    (1, 9, 'Underwear & Socks',           FALSE, 3),  -- id 36
    -- Mom's Toiletry Bag (id 10)
    (1, 10, 'Toothbrush',                 FALSE, 0),  -- id 37
    (1, 10, 'Makeup Bag',                 FALSE, 1),  -- id 38
    (1, 10, 'Skincare Bag',               FALSE, 2),  -- id 39
    (1, 10, 'Hairdryer',                  FALSE, 3),  -- id 40
    -- Mom's Shoes Bag (id 11)
    (1, 11, 'Heels',                      FALSE, 0),  -- id 41
    (1, 11, 'Flats',                      FALSE, 1),  -- id 42
    (1, 11, 'Sneakers',                   TRUE,  2),  -- id 43
    -- Emma's Bag (id 12)
    (1, 12, 'T-Shirts x3',               FALSE, 0),  -- id 44
    (1, 12, 'Shorts x2',                  FALSE, 1),  -- id 45
    (1, 12, 'Pajamas',                    FALSE, 2),  -- id 46
    (1, 12, 'Stuffed Animal',             TRUE,  3),  -- id 47
    -- Liam's Bag (id 13)
    (1, 13, 'T-Shirts x3',               FALSE, 0),  -- id 48
    (1, 13, 'Shorts x2',                  FALSE, 1),  -- id 49
    (1, 13, 'Pajamas',                    FALSE, 2),  -- id 50
    (1, 13, 'Nintendo Switch',            TRUE,  3),  -- id 51
    -- Kids' Toiletry Bag (id 14)
    (1, 14, 'Toothbrushes x2',           FALSE, 0),  -- id 52
    (1, 14, 'Kids Shampoo',              FALSE, 1),  -- id 53
    (1, 14, 'Baby Wipes',                FALSE, 2),  -- id 54
    (1, 14, 'Kids Sunscreen',            FALSE, 3),  -- id 55
    -- Snacks & Entertainment (id 15)
    (1, 15, 'Snacks',                     FALSE, 0),  -- id 56
    (1, 15, 'iPad + Charger',             TRUE,  1),  -- id 57
    (1, 15, 'Headphones x2',             FALSE, 2),  -- id 58
    (1, 15, 'Books & Coloring',          FALSE, 3),  -- id 59
    -- Documents Pouch (id 16)
    (1, 16, 'Passports x4',              TRUE,  0),  -- id 60
    (1, 16, 'Travel Insurance Copy',     TRUE,  1),  -- id 61
    (1, 16, 'Hotel Confirmations',       TRUE,  2),  -- id 62
    -- Emergency Kit (id 17)
    (1, 17, 'Pain Relievers',            FALSE, 0),  -- id 63
    (1, 17, 'Band-Aids',                 FALSE, 1),  -- id 64
    (1, 17, 'Hand Sanitizer',            FALSE, 2),  -- id 65
    (1, 17, 'Motion Sickness Meds',      FALSE, 3),  -- id 66
    -- Passports (id 18)
    (1, 18, 'Dad''s Passport',           TRUE,  0),  -- id 67
    (1, 18, 'Mom''s Passport',           TRUE,  1),  -- id 68
    (1, 18, 'Emma''s Passport',          TRUE,  2),  -- id 69
    (1, 18, 'Liam''s Passport',          TRUE,  3);  -- id 70

-- Level 4: Items inside bags inside bags
INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    -- Makeup Bag (id 38)
    (1, 38, 'Foundation',                FALSE, 0),  -- id 71
    (1, 38, 'Mascara',                   FALSE, 1),  -- id 72
    (1, 38, 'Lipstick',                  FALSE, 2),  -- id 73
    -- Skincare Bag (id 39)
    (1, 39, 'Moisturizer',               FALSE, 0),  -- id 74
    (1, 39, 'Sunscreen',                 FALSE, 1),  -- id 75
    (1, 39, 'Eye Cream',                 FALSE, 2);  -- id 76

-- ============================================================
-- Checklist 2: Mountain Hiking (ids 77-87)
-- ============================================================

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (2, NULL, 'Backpack',                FALSE, 0),  -- id 77
    (2, NULL, 'Clothing',                FALSE, 1),  -- id 78
    (2, NULL, 'Navigation',              FALSE, 2);  -- id 79

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (2, 77, 'Water Bottle',              FALSE, 0),  -- id 80
    (2, 77, 'Snacks',                    FALSE, 1),  -- id 81
    (2, 77, 'First Aid Kit',             FALSE, 2),  -- id 82
    (2, 78, 'Hiking Boots',              TRUE,  0),  -- id 83
    (2, 78, 'Rain Jacket',               FALSE, 1),  -- id 84
    (2, 78, 'Thermal Layers',            FALSE, 2),  -- id 85
    (2, 79, 'Trail Map',                 FALSE, 0),  -- id 86
    (2, 79, 'Compass',                   FALSE, 1);  -- id 87

-- ============================================================
-- Checklist 3: NYC City Break (ids 88-97)
-- ============================================================

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (3, NULL, 'Accommodation',           TRUE,  0),  -- id 88
    (3, NULL, 'Activities',              FALSE, 1),  -- id 89
    (3, NULL, 'Packing',                 FALSE, 2);  -- id 90

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (3, 88, 'Hotel Booked',              TRUE,  0),  -- id 91
    (3, 88, 'Check-in Details',          TRUE,  1),  -- id 92
    (3, 89, 'Museum Tickets',            FALSE, 0),  -- id 93
    (3, 89, 'Restaurant Bookings',       FALSE, 1),  -- id 94
    (3, 89, 'Broadway Show',             FALSE, 2),  -- id 95
    (3, 90, 'Comfortable Shoes',         FALSE, 0),  -- id 96
    (3, 90, 'Umbrella',                  FALSE, 1);  -- id 97

-- ============================================================
-- Checklist 4: Business Conference - sarah's (ids 98-105)
-- ============================================================

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (4, NULL, 'Travel',                  TRUE,  0),  -- id 98
    (4, NULL, 'Conference Prep',         FALSE, 1);  -- id 99

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (4, 98,  'Flight Tickets',           TRUE,  0),  -- id 100
    (4, 98,  'Airport Transfer',         FALSE, 1),  -- id 101
    (4, 98,  'Hotel Booked',             TRUE,  2),  -- id 102
    (4, 99,  'Business Cards',           TRUE,  0),  -- id 103
    (4, 99,  'Presentation Slides',      FALSE, 1),  -- id 104
    (4, 99,  'Notebook & Pen',           FALSE, 2);  -- id 105

-- ============================================================
-- Checklist 5: Weekend Camping - mike's (ids 106-117)
-- All checked — completed trip
-- ============================================================

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (5, NULL, 'Gear',                    TRUE, 0),   -- id 106
    (5, NULL, 'Food & Water',            TRUE, 1),   -- id 107
    (5, NULL, 'Safety',                  TRUE, 2);   -- id 108

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (5, 106, 'Tent',                     TRUE, 0),   -- id 109
    (5, 106, 'Sleeping Bag',             TRUE, 1),   -- id 110
    (5, 106, 'Camping Stove',            TRUE, 2),   -- id 111
    (5, 107, 'Canned Goods',             TRUE, 0),   -- id 112
    (5, 107, 'Trail Mix',                TRUE, 1),   -- id 113
    (5, 107, 'Water Filter',             TRUE, 2),   -- id 114
    (5, 108, 'First Aid Kit',            TRUE, 0),   -- id 115
    (5, 108, 'Emergency Whistle',        TRUE, 1),   -- id 116
    (5, 108, 'Flashlight',               TRUE, 2);   -- id 117

-- ============================================================
-- Checklist 6: Europe Backpacking - sarah's (ids 118-128)
-- Future trip, barely started
-- ============================================================

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (6, NULL, 'Documents',               FALSE, 0),  -- id 118
    (6, NULL, 'Budget & Money',          FALSE, 1),  -- id 119
    (6, NULL, 'Packing',                 FALSE, 2);  -- id 120

INSERT INTO items (checklist_id, parent_item_id, name, is_checked, position)
VALUES
    (6, 118, 'Passport Valid',           TRUE,  0),  -- id 121
    (6, 118, 'Schengen Visa',            FALSE, 1),  -- id 122
    (6, 118, 'Travel Insurance',         FALSE, 2),  -- id 123
    (6, 119, 'Currency Exchange',        FALSE, 0),  -- id 124
    (6, 119, 'Travel Card',              FALSE, 1),  -- id 125
    (6, 119, 'Budget Spreadsheet',       FALSE, 2),  -- id 126
    (6, 120, 'Backpack',                 FALSE, 0),  -- id 127
    (6, 120, 'Hostel Bookings',          FALSE, 1);  -- id 128
