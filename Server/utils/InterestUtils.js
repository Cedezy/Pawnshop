// utils/InterestUtil.js

/**
 * Calculate one month interest
 * @param {Number} loanAmount
 * @param {Number} rate - decimal (ex: 0.03)
 */
exports.calculateMonthlyInterest = (loanAmount, ratePercent) => {
    if (!loanAmount || !ratePercent) return 0;
    const rate = ratePercent / 100; // convert percent to decimal
    return Number((loanAmount * rate).toFixed(2));
};



/**
 * Calculate number of months between two dates (pawn logic)
 * Any excess day counts as 1 month
 */
exports.calculatePawnMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    // If there are extra days, count as 1 month
    if (end.getDate() > start.getDate()) {
        months += 1;
    }

    return months <= 0 ? 1 : months;
};


/**
 * Calculate total interest due
 */
exports.calculateTotalInterest = (loanAmount, rate, months) => {
    const monthly = loanAmount * rate;
    return Number((monthly * months).toFixed(2));
};
