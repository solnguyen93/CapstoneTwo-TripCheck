const sqlForPartialUpdate = (dataToUpdate, jsToSql = {}) => {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) {
        throw new BadRequestError('No data provided for update');
    }

    const setCols = keys.map((key, idx) => {
        const columnName = jsToSql[key] || key;
        return `"${columnName}"=$${idx + 1}`;
    });

    const values = keys.map((key) => dataToUpdate[key]);

    return {
        setCols: setCols.join(', '),
        values,
    };
};

const camelToSnake = (obj) => {
    const snakeObj = {};
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            snakeKey = snakeKey.replace(/^./, (match) => match.toLowerCase()); // Convert first letter to lowercase

            // Convert snake_case date fields to camelCase and parse dates
            if (snakeKey.includes('date')) {
                snakeObj[snakeKey] = new Date(obj[key]);
            } else {
                snakeObj[snakeKey] = obj[key];
            }
        }
    }
    return snakeObj;
};

function snakeToCamel(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item));
    }

    return Object.keys(obj).reduce((acc, key) => {
        let camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        camelCaseKey = camelCaseKey.replace(/^./, (match) => match.toLowerCase()); // Convert first letter to lowercase

        // Convert snake_case date fields to camelCase and parse dates
        if (camelCaseKey.includes('Date')) {
            acc[camelCaseKey] = new Date(obj[key]);
        } else {
            acc[camelCaseKey] = snakeToCamel(obj[key]);
        }

        return acc;
    }, {});
}

module.exports = { camelToSnake, snakeToCamel, sqlForPartialUpdate };
