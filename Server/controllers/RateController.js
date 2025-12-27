const InterestRate = require("../models/InterestRate");
const ScheduleRate = require("../models/ScheduleRate");

exports.addInterestRate = async (req, res) => {
    try {
        const { rate, effectivityDate } = req.body;

        const newRate = await InterestRate.create({
            rate,
            effectivityDate
        });

        res.status(201).json({
            message: "Interest rate added successfully!",
            newRate
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInterestRates = async (req, res) => {
    try {
        const rates = await InterestRate.find().sort({ effectivityDate: -1 });
        res.json({ rates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInterestRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { rate, effectivityDate } = req.body;

        const updatedRate = await InterestRate.findByIdAndUpdate(
            id,
            { rate, effectivityDate },
            { new: true }
        );

        if (!updatedRate) {
            return res.status(404).json({ message: "Interest rate not found" });
        }

        res.json({
            message: "Interest rate updated successfully!",
            updatedRate
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addScheduleRates = async (req, res) => {
    try {
        const { effectivityDate, firstSchedule, secondSchedule, thirdSchedule } = req.body;

        const newSchedule = await ScheduleRate.create({
            effectivityDate,
            firstSchedule,
            secondSchedule,
            thirdSchedule
        });

        res.status(201).json({
            message: "Schedule rate added successfully!",
            newSchedule
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateScheduleRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { effectivityDate, firstSchedule, secondSchedule, thirdSchedule } = req.body;

        const updatedSchedule = await ScheduleRate.findByIdAndUpdate(
            id,
            { effectivityDate, firstSchedule, secondSchedule, thirdSchedule },
            { new: true }
        );

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule rate not found" });
        }

        res.json({
            message: "Schedule rate updated successfully!",
            updatedSchedule
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getScheduleRate = async (req, res) => {
    try {
        const rates = await ScheduleRate.find().sort({ effectivityDate: -1 });
        res.json({ rates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}