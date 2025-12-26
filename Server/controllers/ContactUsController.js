const ContactInfo = require('../models/ContactUs.js');

exports.getContactInfo = async (req, res) => {
    try {
        const info = await ContactInfo.findOne();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.upsertContactInfo = async (req, res) => {
    try {
        const updated = await ContactInfo.findOneAndUpdate(
        {},
        req.body,
        { new: true, upsert: true }
        );

        res.status(200).json({
        message: "Contact information updated successfully",
        data: updated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
