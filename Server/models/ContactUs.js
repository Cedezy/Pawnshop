const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        default: "F. A. PAWNSHOP"
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    businessHours: {
        type: String,
        default: "Monday - Sunday | 8:00 AM - 5:00 PM"
    },
    facebook: {
        type: String
    }
},{ 
    timestamps: true 
});

module.exports = mongoose.model("ContactUs", contactUsSchema);

