const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    phone: { type: String, required: true },

    street: { type: String },
    barangay: { type: String },
    city: { type: String },
    province: { type: String },
    zipCode: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
