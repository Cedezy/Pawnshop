const ScheduleRate = require("../models/ScheduleRate");

/**
 * Get the schedule interest rate for a pawn based on payment count
 * @param {Date} pawnStartDate - Pawn start date
 * @param {number} paymentNumber - nth payment (1-based)
 * @returns {Promise<number>} - Schedule rate %
 */
const getScheduleInterestRate = async (pawnStartDate, paymentNumber) => {
    try {
        const schedule = await ScheduleRate.findOne({
            effectivityDate: { $lte: pawnStartDate }
        }).sort({ effectivityDate: -1 });

        if (!schedule) return 0;

        switch (paymentNumber) {
            case 1: return schedule.firstSchedule;
            case 2: return schedule.secondSchedule;
            case 3: 
            default: return schedule.thirdSchedule; // 3rd and beyond
        }
    } catch (err) {
        console.error("getScheduleInterestRate error:", err);
        return 0;
    }
};

module.exports = getScheduleInterestRate;
