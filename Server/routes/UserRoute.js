const express = require("express");
const router = express.Router();
const { createStaff, getCurrentUser, getAllStaff, getStaffById, updateStaff, deactivateStaff, reactivateStaff, updateMyPassword } = require("../controllers/UserController");
const { userVerification } = require("../middlewares/AuthMiddleware")
const { requireAdmin } = require("../middlewares/RequireMiddleware")

router.post("/", userVerification, requireAdmin, createStaff);
router.get('/me', userVerification, getCurrentUser);
router.get("/", userVerification, getAllStaff);
router.get("/:id", userVerification, getStaffById);
router.put("/:id", userVerification, updateStaff);
router.put("/:id/deactivate", userVerification, requireAdmin, deactivateStaff);
router.put("/:id/reactivate", userVerification, requireAdmin, reactivateStaff);
router.put("/me/password", userVerification, updateMyPassword);

module.exports = router;
