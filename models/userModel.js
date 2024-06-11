const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    specialty: {
        type: String,
    },
    skills: {
        type: [String],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    birth: {
        type: Date,
    },
    phone: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]

});

// Export the model
module.exports = mongoose.model('User', userSchema);
