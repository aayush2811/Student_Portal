const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer')
const emailController = require('../controller/emailController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/email_compose',authMiddleware, upload.array('attachments',10), emailController.sendEmail);


module.exports = router;