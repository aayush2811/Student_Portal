const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const authMiddleware = require('../middleware/authMiddleware'); 
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/app_profile', authMiddleware, postController.getPosts);
router.post('/app_profile/create', authMiddleware, upload.single('imageUrl'), postController.createPost);
router.post('/app_profile/:postId/like', authMiddleware, postController.likePost);
router.post('/app_profile/:postId/reply', authMiddleware, postController.replyToPost);

module.exports = router;
