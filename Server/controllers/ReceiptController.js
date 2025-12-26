const Receipt = require("../models/Receipt");

exports.getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id)
            .populate("pawnId")
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })
            .populate("createdBy", "firstname lastname");

        if (!receipt) return res.status(404).json({ message: "Receipt not found" });

        res.json({ receipt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReceiptsByCustomer = async (req, res) => {
    try {
        const receipts = await Receipt.find({ customerId: req.params.customerId })
            .sort({ date: -1 })
            .populate("pawnId", "itemName loanAmount")
            .populate("createdBy", "firstname lastname");

        res.json({ receipts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReceiptsByPawn = async (req, res) => {
    try {
        const receipts = await Receipt.find({ pawnId: req.params.pawnId })
            .sort({ date: 1 })
            .populate("createdBy", "firstname lastname")
            .populate({
                path: "customerId",
                populate: { path: "userId", select: "firstname lastname" }
            })

        res.json({ receipts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
