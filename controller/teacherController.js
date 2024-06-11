const Teacher = require('../models/teacherModel');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.getTeacherData = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        const limit = parseInt(req.query.limit) || 5; 
        const page = parseInt(req.query.page) || 1; 
        const skip = (page - 1) * limit;

        const [teacherspage, totalTeachers] = await Promise.all([
            Teacher.find().skip(skip).limit(limit).exec(),
            Teacher.countDocuments().exec()
        ])

        const totalPages = Math.ceil(totalTeachers / limit);
        console.log('Teachers:', teachers);
        console.log('Current Page:', page);
        console.log('Total Teachers:', totalTeachers);
        console.log('Total Pages:', totalPages);

        res.render('teacher', {
            teacherspage,
            currentPage: page,
            totalTeachers,
            totalPages,
            teachers
        });
        // res.render('teacher', { teachers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addTeacher = [
    upload.single('photo'),
    async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
                address,
                dateOfBirth,
                placeOfBirth,
                university,
                degree,
                city,
                startDate,
                endDate,
                subjects,
                otherSubject
            } = req.body;
            let subjectsArray = Array.isArray(subjects) ? subjects : [subjects]; // Ensure subjects is an array

            if (otherSubject) {
                subjectsArray.push(otherSubject); // Add otherSubject to subjects array if it exists
            }
            const newTeacher = new Teacher({
                firstName,
                lastName,
                email,
                phoneNumber,
                address,
                dateOfBirth,
                placeOfBirth,
                photo: req.file.path,
                university,
                degree,
                city,
                startDate,
                endDate,
                subjects: subjectsArray
            });

            await newTeacher.save();
            res.render('add_teacher')
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

exports.editTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.render('edit_teacher', { teacher });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.postEditTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        teacher.firstName = req.body.firstName;
        teacher.lastName = req.body.lastName;
        teacher.email = req.body.email;
        teacher.phoneNumber = req.body.phoneNumber;
        teacher.address = req.body.address;
        teacher.dateOfBirth = req.body.dateOfBirth;
        teacher.placeOfBirth = req.body.placeOfBirth;
        teacher.university = req.body.university;
        teacher.degree = req.body.degree;
        teacher.city = req.body.city;
        teacher.startDate = req.body.startDate;
        teacher.endDate = req.body.endDate;
        teacher.subjects = req.body.subjects;
        if (req.file) {
            teacher.photo = req.file.path;
        }
        await teacher.save();
        res.redirect('/teacher');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}






exports.searchTeacher = async (req, res) => {
    const query = req.query.q || '';
    const sort = req.query.sort || 'newest';
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
    } else if (sort === 'recent') {
        sortOption = { updatedAt: -1 };
    }
    try {
        const teachers = await Teacher.find({
            $or: [
                { firstName: new RegExp(query, 'i') },
                { lastName: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
            ]
        }).sort(sortOption);
        console.log('sort:', sort);
        res.render('teacher', { teachers, sort });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            console.error('Teacher not found with id:', req.params.id);
            return res.status(404).json({ message: 'Teacher not found' });
        }
        console.log('Teacher deleted successfully:', req.params.id);
        res.redirect('/teacher');
    } catch (error) {
        console.error('Error deleting teacher:', error.message); 
        res.status(500).send('Server error');
    }
};

