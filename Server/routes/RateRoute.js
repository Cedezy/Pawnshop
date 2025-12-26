const express = require("express");
const router = express.Router();

const {
    addInterestRate,
    getInterestRates,
    updateInterestRate,
    addScheduleRates,
    updateScheduleRate,
    getCurrentRates
} = require("../controllers/RateController");

const { userVerification } = require("../middlewares/AuthMiddleware");
const { requireAdmin } = require("../middlewares/RequireMiddleware");

/* ================= MONTHLY RATE ================= */
router.post("/interest", userVerification, requireAdmin, addInterestRate);
router.get("/interest", userVerification, requireAdmin, getInterestRates);
router.put("/interest/:id", userVerification, requireAdmin, updateInterestRate);

/* ================= SCHEDULE RATE ================= */
router.post("/schedule-rate", userVerification, requireAdmin, addScheduleRates);
router.put("/schedule-rate/:id", userVerification, requireAdmin, updateScheduleRate);

/* ================= CURRENT RATE ================= */
router.get("/current", userVerification, getCurrentRates);

module.exports = router;
