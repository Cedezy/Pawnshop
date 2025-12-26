const express = require('express');
const router = express.Router();
const { getContactInfo, upsertContactInfo } = require('../controllers/ContactUsController');
const { requireAdmin } = require('../middlewares/RequireMiddleware');
const { userVerification } = require('../middlewares/AuthMiddleware');

router.get("/", getContactInfo);        
router.put("/", userVerification, requireAdmin, upsertContactInfo);     

module.exports = router
