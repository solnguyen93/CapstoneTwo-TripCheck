// Demonstrating proficiency with functions instead of class methods.

const pool = require('../db');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');
/**
 * Checklist
 */

const getChecklistById = async (checklistId, userId) => {
    try {
        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.trip_destination , c.trip_from_date, c.trip_to_date
            FROM checklists c
            JOIN user_checklists uc ON c.id = uc.checklist_id 
            WHERE c.id = $1 AND uc.user_id = $2`,
            [checklistId, userId]
        );
        if (!result.rows[0]) {
            throw new NotFoundError(`Checklist not found with id: ${checklistId}`);
        }
        return result.rows[0];
    } catch (error) {
        console.error(`Error fetching checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error fetching checklist with id ${checklistId}: ${error.message}`);
    }
};

const getChecklistsByUserId = async (userId) => {
    try {
        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.trip_destination, c.trip_from_date , c.trip_to_date 
            FROM checklists c
            JOIN user_checklists uc ON c.id = uc.checklist_id
            WHERE uc.user_id = $1  `,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error(`Error fetching checklists for user with id ${userId}:`, error);
        throw new BadRequestError(`Error fetching checklists for user with id ${userId}: ${error.message}`);
    }
};

const editChecklist = async (newChecklist, checklistId, userId) => {
    const { title, description, trip_destination, trip_from_date, trip_to_date } = newChecklist;
    try {
        const result = await pool.query(
            `UPDATE checklists 
            SET title = $1, description = $2, trip_destination = $3, trip_from_date = $4, trip_to_date = $5
            WHERE id = $6
            RETURNING *`,
            [title, description, trip_destination, trip_from_date, trip_to_date, checklistId]
        );

        // Check if checklist was found
        if (!result.rows[0]) {
            throw new NotFoundError(`Checklist not found with id: ${checklistId}`);
        }

        return result;
    } catch (error) {
        console.error(`Error editing checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error editing checklist with id ${checklistId}: ${error.message}`);
    }
};

const deleteChecklistById = async (checklistId, userId) => {
    try {
        const result = await pool.query(
            `DELETE FROM checklists c 
            USING user_checklists uc 
            WHERE c.id = uc.checklist_id 
            AND c.id = $1 AND uc.user_id = $2`,
            [checklistId, userId]
        );
        if (!result.rows[0]) {
            throw new NotFoundError(`Checklist not found with id: ${checklistId}`);
        }
        return result.rows[0];
    } catch (error) {
        console.error(`Error deleting checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error deleting checklist with id ${checklistId}: ${error.message}`);
    }
};

const addChecklist = async (newChecklist, userId) => {
    const { title, description, trip_destination, trip_from_date, trip_to_date } = newChecklist;
    try {
        const checklistResult = await pool.query(
            `INSERT INTO checklists (title, description, trip_destination, trip_from_date, trip_to_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [title, description, trip_destination, trip_from_date, trip_to_date]
        );
        const newChecklist = checklistResult.rows[0];
        await pool.query(
            `INSERT INTO user_checklists (user_id, checklist_id, role)
            VALUES ($1, $2, 'owner')
            RETURNING *`,
            [userId, newChecklist.id]
        );
        await pool.query(
            `INSERT INTO items (name, checklist_id, is_checked, position)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            ['Suitcase', newChecklist.id, false, 0]
        );
        return newChecklist;
    } catch (error) {
        console.error('Error adding checklist:', error);
        throw new BadRequestError(`Error adding checklist: ${error.message}`);
    }
};

/**
 * Item
 */

const getItemsByChecklistId = async (checklistId, userId) => {
    try {
        const result = await pool.query(
            `SELECT i.id, i.checklist_id, i.parent_item_id, i.name, i.position, i.is_checked
             FROM items i
             JOIN user_checklists uc ON i.checklist_id = uc.checklist_id
             WHERE i.checklist_id = $1 AND uc.user_id = $2
             ORDER BY i.parent_item_id NULLS FIRST, i.position`,
            [checklistId, userId]
        );

        const tree = await buildTree(result.rows);
        return tree;
    } catch (error) {
        console.error(`Error fetching items for checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error fetching items for checklist with id ${checklistId}: ${error.message}`);
    }
};

const toggleItem = async (itemId) => {
    try {
        const result = await pool.query(
            `WITH selected_item AS (
            SELECT is_checked FROM items WHERE id = $1)
            UPDATE items
            SET is_checked = NOT (SELECT is_checked FROM selected_item)
            WHERE id = $1
            RETURNING is_checked`,
            [itemId]
        );
        if (!result.rows.length) {
            throw new NotFoundError(`Item not found with id: ${itemId}`);
        }
        return { message: 'Item status toggled successfully' };
    } catch (error) {
        console.error('Error toggling item status:', error);
        throw new BadRequestError(`Error toggling item status: ${error.message}`);
    }
};

const updateItemName = async (itemId, newName) => {
    try {
        const result = await pool.query('UPDATE items SET name = $1 WHERE id = $2 RETURNING *', [newName, itemId]);
        if (!result.rows.length) {
            throw new NotFoundError(`Item not found with id: ${itemId}`);
        }
        return { message: 'Item name updated successfully' };
    } catch (error) {
        console.error('Error updating item name:', error);
        throw new BadRequestError(`Error updating item name: ${error.message}`);
    }
};

const deleteItemRecursively = async (itemId) => {
    try {
        // Get all children items of the current item
        const children = await pool.query('SELECT * FROM items WHERE parent_item_id = $1', [itemId]);
        // Recursively delete each child item and its descendants
        for (const child of children.rows) {
            await deleteItemRecursively(child.id);
        }
        // After deleting all descendants, delete the current item
        await pool.query('DELETE FROM items WHERE id = $1', [itemId]);
    } catch (error) {
        console.error('Error deleting item:', error);
        throw new BadRequestError(`Error deleting item: ${error.message}`);
    }
};

const deleteItem = async (itemId) => {
    try {
        await deleteItemRecursively(itemId);
        return { message: 'Item and its descendants deleted successfully' };
    } catch (error) {
        console.error('Error deleting item:', error);
        throw new BadRequestError(`Error deleting item: ${error.message}`);
    }
};

const addItem = async (newItem) => {
    const { name, checklist_id, parent_item_id, is_checked, position } = newItem;
    try {
        await pool.query('UPDATE items SET position = position + 1 WHERE (parent_item_id = $1 OR parent_item_id IS NULL) AND position >= $2', [
            parent_item_id,
            position,
        ]);

        const result = await pool.query(
            'INSERT INTO items (name, checklist_id, parent_item_id, is_checked, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, checklist_id, parent_item_id, is_checked, position]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding item:', error);
        throw new BadRequestError(`Error adding item: ${error.message}`);
    }
};

const buildTree = async (items, parentId = null) => {
    const tree = [];

    items.forEach(async (item) => {
        if (item.parent_item_id === parentId) {
            const children = await buildTree(items, item.id);
            tree.push({ ...item, children });
        }
    });

    return tree;
};

module.exports = {
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
};

// const getAllChecklists = async () => {
//     try {
//         const result = await pool.query('SELECT * FROM checklists');
//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching all checklists:', error);
//         throw new BadRequestError(`Error fetching all checklists: ${error.message}`);
//     }
// };
