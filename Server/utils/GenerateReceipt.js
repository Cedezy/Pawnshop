// utils/GenerateReceipt.js
const Receipt = require("../models/Receipt");

const generateReceiptNumber = async () => {
    const last = await Receipt.findOne().sort({ createdAt: -1 });

    // Remove any non-digits from last receipt number
    const lastNumber = last?.receiptNumber ? parseInt(last.receiptNumber.replace(/\D/g, "")) : 0;

    const newNumber = String(lastNumber + 1).padStart(7, "0"); // 7 digits
    return `REC-${newNumber}`; // Add prefix
};

module.exports = { generateReceiptNumber };
