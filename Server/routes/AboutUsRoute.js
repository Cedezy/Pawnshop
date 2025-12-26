const express = require('express');
const router = express.Router();
const { getAboutUs, updateAboutUs } = require('../controllers/AboutUsController');
const { requireAdmin } = require('../middlewares/RequireMiddleware');
const { userVerification } = require('../middlewares/AuthMiddleware');

router.get('/', getAboutUs);
router.put('/', userVerification, requireAdmin, updateAboutUs);

module.exports = router;
