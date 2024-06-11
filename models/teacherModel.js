// models/teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    placeOfBirth: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    subjects: {
        type: [String],
        required: true,
    },
    otherSubject: {
        type: String, // Assuming otherSubject is a single custom subject
    },
}, 
{ timestamps: true });


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
