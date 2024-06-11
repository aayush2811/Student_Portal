const express = require('express');
const router = express.Router();
const teacherController = require('../controller/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('photo');

router.post('/add_teacher', teacherController.addTeacher);
router.get('/teacher', teacherController.getTeacherData);

// Edit Teacher
router.get('edit_teacher/:id',authMiddleware, teacherController.editTeacher);
router.post('edit_teacher/:id',upload,authMiddleware, teacherController.postEditTeacher);

// Delete Teacher
router.post('/delete_teacher/:id', authMiddleware, teacherController.deleteTeacher);

// Search teacher
router.get('/search_teacher',authMiddleware, teacherController.searchTeacher);
// Pagination



module.exports = router