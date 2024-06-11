const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'On Hold'], default: 'Pending'
    },
    shippingAddress: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Order', orderSchema)