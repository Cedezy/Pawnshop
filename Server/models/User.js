const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true, 
    },
    lastname: { 
        type: String, 
        required: true,  
    },
    middlename: { 
        type: String,  
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    }, 
    role: { 
        type: String, 
        enum: ["admin", "manager", "appraiser", "customer"], 
        default: "customer" 
    },
    lastLogin: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    otp: String,
    otpExpiry: Date,

    resetOtp: String,
    resetOtpExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
