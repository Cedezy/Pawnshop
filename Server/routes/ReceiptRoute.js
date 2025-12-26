const express = require("express");
const router = express.Router();
const { getReceiptById, getReceiptsByCustomer, getReceiptsByPawn } = require("../controllers/ReceiptController");
const { userVerification } = require("../middlewares/AuthMiddleware");

router.get("/:id", userVerification, getReceiptById);
router.get("/customer/:customerId", getReceiptsByCustomer);
router.get("/pawn/:pawnId", getReceiptsByPawn);

module.exports = router;
