const { log } = require('console');
const StudentParent = require('../models/studentModel');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('photo');

exports.createStudentParent = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const studentParentData = {
            studentFirstName: req.body.studentFirstName,
            studentLastName: req.body.studentLastName,
            dateOfBirth: req.body.dateOfBirth,
            placeOfBirth: req.body.placeOfBirth,
            studentEmail: req.body.studentEmail,
            studentAddress: req.body.studentAddress,
            studentPhoneNumber: req.body.studentPhoneNumber,
            parentName: req.body.parentName,
            parentLastName: req.body.parentLastName,
            parentEmail: req.body.parentEmail,
            parentAddress: req.body.parentAddress,
            parentPhoneNumber: req.body.parentPhoneNumber,
            paymentMethods: req.body.paymentMethods,
            photo: req.file ? req.file.filename : null
        };

        const studentParent = new StudentParent(studentParentData);

        studentParent.save()
            .then(result => {
                res.redirect('/student');
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
};


exports.getStudentData = async (req, res) => {
    try {
        const students = await StudentParent.find();
        res.render('student', { students });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEditStudent = async (req, res) => {
    try {
        const student = await StudentParent.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.render('edit_student', { student });
    } catch (error) {
        res.status(500).send('Server error');
    }

}

exports.postEditStudent = async (req, res) => {
    try {
        const student = await StudentParent.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.studentFirstName = req.body.studentFirstName;
        student.studentLastName = req.body.studentLastName;
        student.dateOfBirth = req.body.dateOfBirth;
        student.placeOfBirth = req.body.placeOfBirth;
        student.studentEmail = req.body.studentEmail;
        student.studentAddress = req.body.studentAddress;
        student.studentPhoneNumber = req.body.studentPhoneNumber;
        student.parentName = req.body.parentName;
        student.parentLastName = req.body.parentLastName;
        student.parentEmail = req.body.parentEmail;
        student.parentAddress = req.body.parentAddress;
        student.parentPhoneNumber = req.body.parentPhoneNumber;
        student.paymentMethods = req.body.paymentMethods;
        if (req.file) {
            student.photo = req.file.filename;
        }
        await student.save();
        res.redirect('/student');
    } catch (error) {
        res.status(400).send('Server error');

    }
}


exports.deleteStudent = async (req, res) => {
    try {
        const student = await StudentParent.findByIdAndDelete(req.params.id);
        if (!student) {
            console.error('Student not found with id:', req.params.id); // Log if student is not found
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log('Student deleted successfully:', req.params.id); // Log successful deletion
        res.redirect('/student');
    } catch (error) {
        console.error('Error deleting student:', error.message); // Log the error message
        res.status(500).send('Server error');
    }
};

exports.searchStudent = async (req, res) => {
    const query = req.query.q;
    console.log(query);
    const sort = req.query.sort || 'newest';
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
    } else if (sort === 'recent') {
        sortOption = { updatedAt: -1 };
    }
    try {
        const students = await StudentParent.find({
            $or: [
                { studentFirstName: new RegExp(query, 'i') },
                { studentLastName: new RegExp(query, 'i') },
                { studentEmail: new RegExp(query, 'i') },
                { parentName: new RegExp(query, 'i') },
                { parentLastName: new RegExp(query, 'i') },
                { parentEmail: new RegExp(query, 'i') },
            ]
        
        }).sort(sortOption)
        res.render('student', { students , sort });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
