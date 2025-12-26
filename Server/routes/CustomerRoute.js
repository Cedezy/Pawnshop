const express = require("express");
const router = express.Router();
const { 
    createCustomer, 
    getCustomerById, 
    getAllCustomers,
    getOwnProfile, 
    updateOwnProfile,
    updateCustomer, 
    toggleCustomerStatus,
    getCustomerTransactionHistory
} = require("../controllers/CustomerController");
const { userVerification } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/UploadMiddleware");

router.post("/",
    userVerification,
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "idPhoto", maxCount: 1 }
    ]),
    createCustomer
);

router.get("/", userVerification, getAllCustomers);
router.get("/my-profile", userVerification, getOwnProfile);
router.get("/:id", userVerification, getCustomerById);
router.get("/:id/transactions", userVerification, getCustomerTransactionHistory);
router.put("/update", userVerification, updateOwnProfile);
router.put("/:id", userVerification, updateCustomer);
router.delete("/:id", userVerification, toggleCustomerStatus);

module.exports = router;
