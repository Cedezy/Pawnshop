// utils/dateUtils.js

/**
 * Add X days to a date.
 * @param {Date | string} date - The base date
 * @param {number} days - Number of days to add
 * @returns {Date}
 */
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

module.exports = { addDays };
