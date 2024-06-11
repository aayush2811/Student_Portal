const mongoose = require('mongoose');

const studentParentSchema = new mongoose.Schema({
    studentFirstName: {
        type: String,
        required: true
    },
    studentLastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        // required: true
    },
    placeOfBirth: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    studentAddress: {
        type: String,
        required: true
    },
    studentPhoneNumber: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    
    parentLastName: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },
    parentAddress: {
        type: String,
        required: true
    },
    parentPhoneNumber: {
        type: String,
        required: true
    },
    paymentMethods: {
        type: [String],
        enum: ['Cash', 'Debits'],
        required: true
    },
    photo: {
        type: String, 
        default: ""}

}, { timestamps: true });

// Create the model from the schema
const StudentParent = mongoose.model('StudentParent', studentParentSchema);

module.exports = StudentParent;
