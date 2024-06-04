import axios from 'axios';

// Base URL for API requests, using environment variable if available
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

// Class for handling API requests related to TripCheck
class TripCheckApi {
    // Function to make a request to the API
    static async request(endpoint, data = {}, method = 'get') {
        // Log the API call details
        console.debug('API Call:', endpoint, data, method);

        // Construct the full URL for the request
        const url = `${BASE_URL}/${endpoint}`;

        // Get the token from localStorage for authorization
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: token ? `Bearer ${token}` : undefined, // Include the token if it exists
        };

        // Determine whether to pass data in body or query parameters based on HTTP method
        const params = method === 'get' ? data : {};

        try {
            // Make the request using axios and return the response data
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            // Handle errors from the API response
            console.error('API Error:', err.response);
            let message = err.response.data.error.message;
            // Throw an array of error messages for consistency
            throw Array.isArray(message) ? message : [message];
        }
    }

    /**
     * Checklist routes
     */

    // ADMIN - Get all checklists
    static async getAllChecklists() {
        try {
            let res = await TripCheckApi.request('checklist/all');
            return res;
        } catch (error) {
            console.error('Error fetching all checklists:', error);
            throw error;
        }
    }

    // Get checklists by user ID
    static async getChecklistsByUserId() {
        try {
            let res = await TripCheckApi.request('checklist');
            return res;
        } catch (error) {
            console.error('Error fetching all checklists:', error);
            throw error;
        }
    }

    // Get checklist by ID
    static async getChecklistById(checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}`);
            return res;
        } catch (error) {
            console.error('Error fetching checklist by id:', error);
            throw error;
        }
    }

    // Edit checklist
    static async editChecklist(newChecklist, checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}`, newChecklist, 'put');
            return res;
        } catch (error) {
            console.error('Error editing checklist:', error);
            throw error;
        }
    }

    // Delete checklist by ID
    static async deleteChecklistById(checklistId) {
        console.log('checklistId in tripcheckapi', checklistId);
        try {
            const res = await TripCheckApi.request(`checklist/${checklistId}`, {}, 'delete');
            return res;
        } catch (error) {
            console.error('Error deleting checklist by id:', error);
            throw error;
        }
    }

    // Add checklist
    static async addChecklist(data) {
        try {
            const res = await TripCheckApi.request(`checklist/new`, data, 'post');
            return res;
        } catch (error) {
            console.error('Error adding checklist:', error);
            throw error;
        }
    }

    /**
     * Item routes
     */

    // Get items by checklist ID
    static async getItemsByChecklistId(checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}/items`);
            return res;
        } catch (error) {
            console.error('Error fetching items by checklist id:', error);
            throw error;
        }
    }

    // Toggle item (check/uncheck)
    static async toggleItem(itemId, checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}/items/${itemId}`, { type: 'toggle' }, 'put');
            return res;
        } catch (error) {
            console.error('Error toggling item check box:', error);
            throw error;
        }
    }

    // Update item name
    static async updateItemName(itemId, newName, checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}/items/${itemId}`, { type: 'updateName', newName }, 'put');
            return res;
        } catch (error) {
            console.error('Error updating item name:', error);
            throw error;
        }
    }

    // Delete item by ID
    static async deleteItem(itemId, checklistId) {
        try {
            const res = await TripCheckApi.request(`checklist/${checklistId}/items/${itemId}`, {}, 'delete');
            return res;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

    // Add item by ID
    static async addItem(data, checklistId) {
        try {
            const res = await TripCheckApi.request(`checklist/${checklistId}/items/new`, data, 'post');
            return res;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }
}

export default TripCheckApi;
