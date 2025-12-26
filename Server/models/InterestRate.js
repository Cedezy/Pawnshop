const mongoose = require("mongoose");

const interestRateSchema = new mongoose.Schema({
    rate: {
        type: Number, 
        required: true,
    },
    effectivityDate: {
        type: Date,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("InterestRate", interestRateSchema);
