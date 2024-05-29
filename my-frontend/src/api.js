import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

class TripCheckApi {
    static async request(endpoint, data = {}, method = 'get') {
        console.debug('API Call:', endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: token ? `Bearer ${token}` : undefined, // Include the token if it exists
        };
        const params = method === 'get' ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error('API Error:', err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /**
     * Checklist routes
     */

    // ADMIN
    static async getAllChecklists() {
        try {
            let res = await TripCheckApi.request('checklist/all');
            return res;
        } catch (error) {
            console.error('Error fetching all checklists:', error);
            throw error;
        }
    }

    static async getChecklistsByUserId() {
        try {
            let res = await TripCheckApi.request('checklist');
            return res;
        } catch (error) {
            console.error('Error fetching all checklists:', error);
            throw error;
        }
    }

    static async getChecklistById(checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}`);
            return res;
        } catch (error) {
            console.error('Error fetching checklist by id:', error);
            throw error;
        }
    }

    static async deleteChecklistById(checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}`, 'delete');
            return res;
        } catch (error) {
            console.error('Error deleting checklist by id:', error);
            throw error;
        }
    }

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

    static async getItemsByChecklistId(checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}/items`);
            return res;
        } catch (error) {
            console.error('Error fetching items by checklist id:', error);
            throw error;
        }
    }

    static async toggleItem(itemId, checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}/items/${itemId}`, { type: 'toggle' }, 'put');
            return res;
        } catch (error) {
            console.error('Error toggling item check box:', error);
            throw error;
        }
    }

    static async updateItemName(itemId, newName, checklistId) {
        try {
            let res = await TripCheckApi.request(`checklist/${checklistId}/items/${itemId}`, { type: 'updateName', newName }, 'put');
            return res;
        } catch (error) {
            console.error('Error updating item name:', error);
            throw error;
        }
    }

    static async deleteItem(itemId, checklistId) {
        try {
            const res = await TripCheckApi.request(`checklist/${checklistId}/items/${itemId}`, {}, 'delete');
            return res;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

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
