const mongoose = require("mongoose");

const pawnSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    itemName: { type: String, required: true },
    itemPhotoUrl: { type: String },

    appraisalValue: { type: Number, required: true },
    loanAmount: { type: Number, required: true },
    balance: { type: Number, default: 0 }, 

    startDate: { type: Date, required: true },
    maturityDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },

    status: {
        type: String,
        enum: ["Active", "Redeemed", "Expired", "Renewed", "Forfeited"],
        default: "Active"
    },

    redeemedDate: { type: Date },
    forfeitedDate: { type: Date },

    payments: [
        {
            amount: { type: Number, required: true },
            date: { type: Date, required: true },
            interestPaid: { type: Number, default: 0 },
            penaltyPaid: { type: Number, default: 0 },
            receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }
        }
    ],


   renewals: [
        {
            oldMaturity: Date,
            newMaturity: Date,
            renewalDate: Date,
            receiptId: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }
        }
    ],

    interestRate: {
        type: Number,
        required: true
    },

    interestType: {
        type: String,
        enum: ["Monthly", "Scheduled"],
        default: "Monthly"
    },

    interestAccrued: {
        type: Number,
        default: 0
    },

    interestPaid: {
        type: Number,
        default: 0
    },

    interestBalance: {
        type: Number,
        default: 0
    },

    totalPenalty: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Pawn", pawnSchema);
