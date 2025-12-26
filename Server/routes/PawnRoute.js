const express = require("express");
const router = express.Router();

const { 
    createPawn, 
    getAllPawns, 
    getMyPawns,
    addPayment, 
    renewPawn, 
    redeemPawn, 
    forfeitPawn 
} = require("../controllers/PawnController");

const { userVerification } = require("../middlewares/AuthMiddleware");
const { requireAdmin } = require("../middlewares/RequireMiddleware");
const upload = require("../middlewares/UploadMiddleware");

router.post("/", userVerification, upload.single("itemPhoto"), createPawn);
router.get("/", userVerification, getAllPawns);
router.get("/my-pawns", userVerification, getMyPawns);
router.post("/:pawnId/payment", userVerification, addPayment);
router.post("/:pawnId/renew", userVerification, renewPawn);
router.post("/:pawnId/redeem", userVerification, redeemPawn);
router.post("/:pawnId/forfeit", userVerification, requireAdmin, forfeitPawn);

module.exports = router;
