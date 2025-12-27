const express = require("express");
const router = express.Router();

const {
    addInterestRate,
    getInterestRates,
    updateInterestRate,
    addScheduleRates,
    updateScheduleRate,
    getScheduleRate
} = require("../controllers/RateController");

const { userVerification } = require("../middlewares/AuthMiddleware");
const { requireAdmin } = require("../middlewares/RequireMiddleware");

router.post("/interest", userVerification, requireAdmin, addInterestRate);
router.get("/interest", userVerification, getInterestRates);
router.put("/interest/:id", userVerification, requireAdmin, updateInterestRate);
router.post("/schedule-rate", userVerification, requireAdmin, addScheduleRates);
router.put("/schedule-rate/:id", userVerification, requireAdmin, updateScheduleRate);
router.get("/current", userVerification, getScheduleRate);

module.exports = router;
