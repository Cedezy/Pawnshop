const mongoose = require("mongoose");

const scheduleRateSchema = new mongoose.Schema({
    effectivityDate: {
        type: Date,
        required: true
    },
    firstSchedule: { type: Number, required: true },   // Example: 5%
    secondSchedule: { type: Number, required: true },  // Example: 10%
    thirdSchedule: { type: Number, required: true }    // Example: 15%
}, { timestamps: true });

module.exports = mongoose.model("ScheduleRate", scheduleRateSchema);
