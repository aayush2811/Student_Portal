const express = require('express');
const router = express.Router();
const studentParentController = require('../controller/studentController');
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

router.post('/add_student',authMiddleware, studentParentController.createStudentParent);
router.get('/student',authMiddleware, studentParentController.getStudentData);

// Route to edit student
router.get('/student/edit/:id',authMiddleware, studentParentController.getEditStudent);
router.post('/student/edit/:id',upload,authMiddleware, studentParentController.postEditStudent);

// Route to delete student
router.post('/student/delete/:id',authMiddleware,studentParentController.deleteStudent);


// Search Student
router.get('/search',authMiddleware, studentParentController.searchStudent);

module.exports = router;
