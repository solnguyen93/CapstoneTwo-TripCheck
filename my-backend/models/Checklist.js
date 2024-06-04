const pool = require('../db'); // Database connection pool
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError'); // Custom error classes
const User = require('../models/User');

/**
 * Checklist
 */

// Function to get a checklist by its ID
const getChecklistById = async (checklistId, userId) => {
    try {
        // Query the database for the checklist with the provided ID and user ID
        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.trip_destination , c.trip_from_date, c.trip_to_date
            FROM checklists c
            JOIN user_checklists uc ON c.id = uc.checklist_id 
            WHERE c.id = $1 AND uc.user_id = $2`,
            [checklistId, userId]
        );
        // Throw a NotFoundError if no checklist is found with the provided ID
        if (!result.rows[0]) {
            throw new NotFoundError(`Checklist not found with id: ${checklistId}`);
        }
        return result.rows[0]; // Return the found checklist
    } catch (error) {
        console.error(`Error fetching checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error fetching checklist with id ${checklistId}: ${error.message}`);
    }
};

// Function to get all checklists belonging to a user
const getChecklistsByUserId = async (userId) => {
    try {
        // Query the database for all checklists belonging to the user with the provided ID
        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.trip_destination, c.trip_from_date , c.trip_to_date 
            FROM checklists c
            JOIN user_checklists uc ON c.id = uc.checklist_id
            WHERE uc.user_id = $1  `,
            [userId]
        );
        return result.rows; // Return the found checklists
    } catch (error) {
        console.error(`Error fetching checklists for user with id ${userId}:`, error);
        throw new BadRequestError(`Error fetching checklists for user with id ${userId}: ${error.message}`);
    }
};

// Function to edit a checklist
const editChecklist = async (newChecklist, checklistId, userId) => {
    const { title, description, trip_destination, trip_from_date, trip_to_date } = newChecklist;
    try {
        // Update the checklist in the database
        const result = await pool.query(
            `UPDATE checklists 
            SET title = $1, description = $2, trip_destination = $3, trip_from_date = $4, trip_to_date = $5
            WHERE id = $6
            RETURNING *`,
            [title, description, trip_destination, trip_from_date, trip_to_date, checklistId]
        );

        // Throw a NotFoundError if no checklist is found with the provided ID
        if (!result.rows[0]) {
            throw new NotFoundError(`Checklist not found with id: ${checklistId}`);
        }

        return result; // Return the updated checklist
    } catch (error) {
        console.error(`Error editing checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error editing checklist with id ${checklistId}: ${error.message}`);
    }
};

// Function to delete a checklist by its ID
const deleteChecklistById = async (checklistId, userId) => {
    try {
        // Delete entry from user_checklists table
        await pool.query(`DELETE FROM user_checklists WHERE checklist_id = $1 AND user_id = $2`, [checklistId, userId]);

        // Check if the requesting user (userId) is the owner of the checklist (checklistId)
        const isOwnerQuery = await pool.query(`SELECT 1 FROM user_checklists WHERE user_id = $1 AND checklist_id = $2 AND role = 'owner'`, [
            userId,
            checklistId,
        ]);

        // If the user is not the owner, throw an UnauthorizedError
        if (!isOwnerQuery.rows.length) {
            return;
        }

        // Delete entry from checklists table
        const result = await pool.query(`DELETE FROM checklists WHERE id = $1 RETURNING *`, [checklistId]);

        // Throw a NotFoundError if no checklist is found with the provided ID
        if (!result.rows[0]) {
            throw new NotFoundError(`Checklist not found with id: ${checklistId}`);
        }
        return { message: 'Deleted check list successfully' };
    } catch (error) {
        console.error(`Error deleting checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error deleting checklist with id ${checklistId}: ${error.message}`);
    }
};

// Function to add a new checklist
const addChecklist = async (newChecklist, userId) => {
    const { title, description, trip_destination, trip_from_date, trip_to_date } = newChecklist;
    try {
        // Insert the new checklist into the database
        const checklistResult = await pool.query(
            `INSERT INTO checklists (title, description, trip_destination, trip_from_date, trip_to_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [title, description, trip_destination, trip_from_date, trip_to_date]
        );
        const newChecklist = checklistResult.rows[0];

        // Add entry to user_checklists table
        await pool.query(
            `INSERT INTO user_checklists (user_id, checklist_id, role)
            VALUES ($1, $2, 'owner')
            RETURNING *`,
            [userId, newChecklist.id]
        );

        // Add default item to the checklist
        await pool.query(
            `INSERT INTO items (name, checklist_id, is_checked, position)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            ['Suitcase', newChecklist.id, false, 0]
        );

        return newChecklist; // Return the new checklist
    } catch (error) {
        console.error('Error adding checklist:', error);
        throw new BadRequestError(`Error adding checklist: ${error.message}`);
    }
};

const shareChecklist = async (checklistId, sharedUserId, userId) => {
    try {
        // Check if the requesting user is trying to add themselves as a shared user
        if (sharedUserId === userId) {
            throw new BadRequestError('You can not add yourself as a shared user');
        }

        // Check if the requesting user (userId) is the owner of the checklist (checklistId)
        const isOwnerQuery = await pool.query(`SELECT 1 FROM user_checklists WHERE user_id = $1 AND checklist_id = $2 AND role = 'owner'`, [
            userId,
            checklistId,
        ]);

        // If the user is not the owner, throw an UnauthorizedError
        if (!isOwnerQuery.rows.length) {
            throw new UnauthorizedError('You are not the owner of this checklist');
        }

        // Check if the entry already exists
        const isSharedQuery = await pool.query(`SELECT * FROM user_checklists WHERE user_id = $1 AND checklist_id = $2`, [sharedUserId, checklistId]);

        // If the entry already exists, return or throw an error
        if (isSharedQuery.rows.length) {
            throw new BadRequestError('Checklist already shared with this user');
        }

        // Add entry to user_checklists table for the shared user
        await pool.query(
            `INSERT INTO user_checklists (user_id, checklist_id, role)
            VALUES ($1, $2, 'shared')`,
            [sharedUserId, checklistId]
        );

        return { message: 'Added shared user successfully' };
    } catch (error) {
        throw error;
    }
};

const getSharedUsers = async (checklistId, userId) => {
    try {
        // Check if the requesting user (userId) is the owner of the checklist (checklistId)
        const isOwnerQuery = await pool.query(`SELECT 1 FROM user_checklists WHERE user_id = $1 AND checklist_id = $2 AND role = 'owner'`, [
            userId,
            checklistId,
        ]);

        // If the user is not the owner, throw an UnauthorizedError
        if (!isOwnerQuery.rows.length) {
            throw new UnauthorizedError('You are not the owner of this checklist');
        }

        // Check if the entry already exists
        const sharedUsers = await pool.query(
            `SELECT u.id, u.username
            FROM users u
            JOIN user_checklists uc ON u.id = uc.user_id
            WHERE uc.checklist_id = $1 AND uc.role = 'shared'
            ORDER BY u.username;`,
            [checklistId]
        );
        if (!sharedUsers.rows.length) {
            return null;
        }

        return sharedUsers.rows;
    } catch (error) {
        throw error;
    }
};

const deleteSharedUser = async (checklistId, sharedUserId, userId) => {
    try {
        // Check if the requesting user (userId) is the owner of the checklist (checklistId)
        const isOwnerQuery = await pool.query(`SELECT 1 FROM user_checklists WHERE user_id = $1 AND checklist_id = $2 AND role = 'owner'`, [
            userId,
            checklistId,
        ]);

        // If the user is not the owner, throw an UnauthorizedError
        if (!isOwnerQuery.rows.length) {
            throw new UnauthorizedError('You are not the owner of this checklist');
        }

        // Check if the entry already exists
        await pool.query(
            `DELETE FROM user_checklists 
            WHERE checklist_id = $1 AND user_id = $2 AND role = 'shared';`,
            [checklistId, sharedUserId]
        );

        return { message: 'Deleted shared user successfully' };
    } catch (error) {
        throw error;
    }
};

/**
 * Item
 */

// Function to get all items by checklist ID
const getItemsByChecklistId = async (checklistId, userId) => {
    try {
        // Query the database for all items belonging to the checklist with the provided ID and user ID
        const result = await pool.query(
            `SELECT i.id, i.checklist_id, i.parent_item_id, i.name, i.position, i.is_checked
             FROM items i
             JOIN user_checklists uc ON i.checklist_id = uc.checklist_id
             WHERE i.checklist_id = $1 AND uc.user_id = $2
             ORDER BY i.parent_item_id NULLS FIRST, i.position`,
            [checklistId, userId]
        );

        // Build a tree structure from the retrieved items
        const tree = await buildTree(result.rows);
        return tree; // Return the tree structure
    } catch (error) {
        console.error(`Error fetching items for checklist with id ${checklistId}:`, error);
        throw new BadRequestError(`Error fetching items for checklist with id ${checklistId}: ${error.message}`);
    }
};

// Function to toggle the status of an item
const toggleItem = async (itemId) => {
    try {
        // Toggle the status of the item in the database
        const result = await pool.query(
            `WITH selected_item AS (
            SELECT is_checked FROM items WHERE id = $1)
            UPDATE items
            SET is_checked = NOT (SELECT is_checked FROM selected_item)
            WHERE id = $1
            RETURNING is_checked`,
            [itemId]
        );
        // Throw a NotFoundError if no item is found with the provided ID
        if (!result.rows.length) {
            throw new NotFoundError(`Item not found with id: ${itemId}`);
        }
        return { message: 'Item status toggled successfully' }; // Return success message
    } catch (error) {
        console.error('Error toggling item status:', error);
        throw new BadRequestError(`Error toggling item status: ${error.message}`);
    }
};

// Function to update the name of an item
const updateItemName = async (itemId, newName) => {
    try {
        // Update the name of the item in the database
        const result = await pool.query('UPDATE items SET name = $1 WHERE id = $2 RETURNING *', [newName, itemId]);
        // Throw a NotFoundError if no item is found with the provided ID
        if (!result.rows.length) {
            throw new NotFoundError(`Item not found with id: ${itemId}`);
        }
        return { message: 'Item name updated successfully' }; // Return success message
    } catch (error) {
        console.error('Error updating item name:', error);
        throw new BadRequestError(`Error updating item name: ${error.message}`);
    }
};

// Function to delete an item and its descendants recursively
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

// Function to delete an item by its ID
const deleteItem = async (itemId) => {
    try {
        // Delete the item and its descendants recursively
        await deleteItemRecursively(itemId);
        return { message: 'Item and its descendants deleted successfully' }; // Return success message
    } catch (error) {
        console.error('Error deleting item:', error);
        throw new BadRequestError(`Error deleting item: ${error.message}`);
    }
};

// Function to add a new item
const addItem = async (newItem) => {
    const { name, checklist_id, parent_item_id, is_checked, position } = newItem;
    try {
        // Update positions of existing items to make space for the new item
        await pool.query('UPDATE items SET position = position + 1 WHERE (parent_item_id = $1 OR parent_item_id IS NULL) AND position >= $2', [
            parent_item_id,
            position,
        ]);

        // Insert the new item into the database
        const result = await pool.query(
            'INSERT INTO items (name, checklist_id, parent_item_id, is_checked, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, checklist_id, parent_item_id, is_checked, position]
        );
        return result.rows[0]; // Return the new item
    } catch (error) {
        console.error('Error adding item:', error);
        throw new BadRequestError(`Error adding item: ${error.message}`);
    }
};

// Function to build a tree structure from items recursively
const buildTree = async (items, parentId = null) => {
    const tree = [];

    items.forEach(async (item) => {
        if (item.parent_item_id === parentId) {
            const children = await buildTree(items, item.id);
            tree.push({ ...item, children });
        }
    });

    return tree; // Return the tree structure
};

// Exporting functions for use in other modules
module.exports = {
    getChecklistById,
    getChecklistsByUserId,
    editChecklist,
    deleteChecklistById,
    addChecklist,
    shareChecklist,
    getSharedUsers,
    deleteSharedUser,
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
