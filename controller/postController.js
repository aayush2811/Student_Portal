const postModel = require('../models/postModel');

exports.getPosts = async (req, res) => {
    try {
        const posts = await postModel.find().populate('createdBy').populate('comments.user').exec();
        res.render('app_profile', { posts: posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPost = async (req, res) => {
    const post = new postModel({
        content: req.body.content,
        imageUrl: req.file ? req.file.path : null,  // Use req.file.path to save the file path
        // createdBy: req.user._id,
    });

    try {
        const savedPost = await post.save();
        res.status(201).redirect('/app_profile'); // Redirect to the profile page after successful post creation
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.likePost = async (req, res) => {
    const postId = req.params.postId;
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    post.likes++;
    try {
        await post.save();
        res.render('app_profile')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.replyToPost = async (req, res) => {
    const postId = req.params.postId;
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const reply = {
        user: req.user._id,
        text: req.body.text,
        createdAt: new Date(),
    };

    post.comments.push(reply);
    try {
        await post.save();
        res.status(201).json({ message: 'Reply created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};