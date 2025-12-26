const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
    pawnId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Pawn" 
    },

    actionType: { 
        type: String, 
        enum: ["Pawn", "Renewal", "Payment", "Redemption"] 
    },

    amount: Number,
    interestPaid: Number,
    oldMaturity: Date,
    newMaturity: Date,
    date: Date,

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer" 
    },
    receiptNumber: { type: String, unique: true } 
}, { timestamps: true });

module.exports = mongoose.model("Receipt", receiptSchema);
