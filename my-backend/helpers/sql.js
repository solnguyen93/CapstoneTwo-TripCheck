const sqlForPartialUpdate = (dataToUpdate, jsToSql = {}) => {
    // Extract keys from the data to update
    const keys = Object.keys(dataToUpdate);
    // Throw an error if no data is provided for update
    if (keys.length === 0) {
        throw new BadRequestError('No data provided for update');
    }

    // Generate SET clause for SQL UPDATE statement
    const setCols = keys.map((key, idx) => {
        // Use custom mappings if provided, otherwise use key as is
        const columnName = jsToSql[key] || key;
        return `"${columnName}"=$${idx + 1}`;
    });

    // Extract values from the data to update
    const values = keys.map((key) => dataToUpdate[key]);

    return {
        setCols: setCols.join(', '), // Joined SET clause
        values, // Array of values to be updated
    };
};

const formatDateToShort = (dateString) => {
    // Return null if dateString is falsy
    if (!dateString) return null;
    // Convert dateString to Date object
    const date = new Date(dateString);
    // Return formatted date string in "yyyy-MM-dd" format
    return date.toISOString().split('T')[0];
};

const formatDateToLong = (dateString) => {
    // Return null if dateString is falsy
    if (!dateString) return null;
    // Convert dateString to Date object
    const date = new Date(dateString);
    // Return formatted date string in ISO 8601 format
    return date.toISOString();
};

const camelToSnake = (obj) => {
    const snakeObj = {};
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Convert camelCase key to snake_case
            let snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            // Convert first letter to lowercase
            snakeKey = snakeKey.replace(/^./, (match) => match.toLowerCase());

            // Convert date strings to long ISO format
            if (snakeKey.includes('date')) {
                snakeObj[snakeKey] = formatDateToLong(obj[key]);
            } else {
                snakeObj[snakeKey] = obj[key];
            }
        }
    }
    return snakeObj;
};

const snakeToCamel = (obj) => {
    // Return obj if it's not an object or null
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // Recursively convert keys from snake_case to camelCase
    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item));
    }

    return Object.keys(obj).reduce((acc, key) => {
        // Convert snake_case key to camelCase
        let camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        // Convert first letter to lowercase
        camelCaseKey = camelCaseKey.replace(/^./, (match) => match.toLowerCase());

        // Convert date strings to short "yyyy-MM-dd" format
        if (camelCaseKey.includes('Date')) {
            acc[camelCaseKey] = formatDateToShort(obj[key]);
        } else {
            acc[camelCaseKey] = snakeToCamel(obj[key]);
        }

        return acc;
    }, {});
};

module.exports = { camelToSnake, snakeToCamel, formatDateToShort, formatDateToLong, sqlForPartialUpdate };
