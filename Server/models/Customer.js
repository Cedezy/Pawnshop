const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    dateOfBirth: { 
        type: Date, 
        required: true 
    },
    sex: { 
        type: String, 
        enum: ["Male", "Female", "Other"] 
    },
    phone: { 
        type: String, 
        required: true 
    },
    street: { 
        type: String 
    },
    barangay: { 
        type: String 
    },
    city: { 
        type: String 
    },
    province: { 
        type: String 
    },
    zipCode: { 
        type: String
    },
    province: { 
        type: String 
    },
    civilStatus: { 
        type: String
    },
    nationality: { 
        type: String, 
        required: true 
    },
    idType: {
        type: String,
        required: true
    },
    idNumber: { 
        type: String, 
        required: true 
    },
    idExpiryDate: { 
        type: Date 
    },
    idPhotoUrl: { 
        type: String 
    }, 

    status: {
        type: String,
        enum: ["Active", "Inactive", "Blacklisted"],
        default: "Active",
    },
    blacklistReason: { 
        type: String 
    },

    pawnCount: { 
        type: Number, 
        default: 0 
    },
    redeemedCount: { 
        type: Number, default: 0 
    },
    pendingLoans: { 
        type: Number, 
        default: 0 
    },
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
