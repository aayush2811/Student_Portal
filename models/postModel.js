const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            text: String,
            replies: [replySchema],
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
