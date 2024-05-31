const express = require('express');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();
const { camelToSnake, snakeToCamel } = require('../helpers/sql');
const {
    getChecklistById,
    getChecklistsByUserId,
    editChecklist,
    deleteChecklistById,
    addChecklist,
    getItemsByChecklistId,
    toggleItem,
    updateItemName,
    deleteItem,
    addItem,
} = require('../models/Checklist');

/**
 * Checklist routes
 */

// Route to get checklist (details) by checklist id
router.get('/:checklistId', authenticateJWT, async (req, res) => {
    const userId = res.locals.user.id;
    const checklistId = req.params.checklistId;
    try {
        const checklist = await getChecklistById(checklistId, userId);
        const camelCaseChecklist = snakeToCamel(checklist); // Convert snake_case keys to camelCase
        res.json(camelCaseChecklist);
    } catch (error) {
        console.error('Error fetching checklist by checklist id:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to get checklists by user id
router.get('/', authenticateJWT, async (req, res) => {
    const userId = res.locals.user.id;
    try {
        const checklists = await getChecklistsByUserId(userId);
        res.json(checklists);
    } catch (error) {
        console.error('Error fetching checklists by user id:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to edit checklists by checklist id
router.put('/:checklistId', authenticateJWT, async (req, res) => {
    const userId = res.locals.user.id;
    const checklistId = req.params.checklistId;
    const data = camelToSnake(req.body);
    try {
        const editedChecklist = await editChecklist(data, checklistId, userId);
        res.json(editedChecklist);
    } catch (error) {
        console.error('Error editing checklist:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to delete checklist by checklist id
router.delete('/:checklistId', authenticateJWT, async (req, res) => {
    const userId = res.locals.user.id;
    const checklistId = req.params.checklistId;
    try {
        const checklist = await deleteChecklistById(checklistId, userId);
        res.json(checklist);
        res.json({ message: 'Checklist editted successfully', checklist });
    } catch (error) {
        console.error('Error fetching checklist and items by checklist id:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to create a new checklist
router.post('/new', authenticateJWT, async (req, res) => {
    const userId = res.locals.user.id;
    try {
        const data = camelToSnake(req.body);
        console.log('TEST 1 - data', data);
        const newChecklist = await addChecklist(data, userId);
        console.log('TEST 2t - checklist', newChecklist);
        res.json({ message: 'Checklist added successfully', newChecklist });
    } catch (error) {
        console.error('Error adding checklist:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Item routes
 */

// Route to get items by checklist id
router.get('/:checklistId/items', authenticateJWT, async (req, res) => {
    const userId = res.locals.user.id;
    const checklistId = req.params.checklistId;
    try {
        const itemsTree = await getItemsByChecklistId(checklistId, userId);
        const itemsArray = Object.values(itemsTree); // Destructure the object into an array
        res.json(itemsArray);
    } catch (error) {
        console.error('Error fetching checklist and items by checklist id:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to edit item name or toggle check box by item id
router.put('/:checklistId/items/:itemId', authenticateJWT, async (req, res) => {
    const { itemId } = req.params;
    const { type, newName } = req.body;

    try {
        if (type === 'toggle') {
            await toggleItem(itemId);
            res.json({ message: 'Item toggled successfully' });
        } else if (type === 'updateName') {
            await updateItemName(itemId, newName);
            res.json({ message: 'Item name updated successfully' });
        } else {
            res.status(400).json({ error: 'Invalid update type' });
        }
    } catch (error) {
        console.error(`Error ${type === 'updateName' ? 'updating item name' : 'toggling item'}:`, error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to delete item by item id
router.delete('/:checklistId/items/:itemId', authenticateJWT, async (req, res) => {
    const itemId = req.params.itemId;
    try {
        await deleteItem(itemId);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to create a new item
router.post('/:checklistId/items/new', authenticateJWT, async (req, res) => {
    try {
        const data = req.body;
        const newItem = await addItem(data);
        res.json({ message: 'Item added successfully', newItem });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

// ADMIN Route to get all checklists
// router.get('/all', ensureAdmin, async (req, res) => {
//     try {
//         const checklists = await getAllChecklists();
//         res.json(checklists);
//     } catch (error) {
//         console.error('Error fetching all checklists:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
