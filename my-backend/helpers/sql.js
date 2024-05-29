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

module.exports = { sqlForPartialUpdate };
