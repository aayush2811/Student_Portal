const User = require('../models/userModel'); // Adjust the path as needed

module.exports = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            if (!user) {
                return res.status(401).send('User not found');
            }
            req.user = user; 
            next();
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    } else {
        req.session.redirectTo = req.originalUrl; 
        res.redirect('/page_login');
    }
};
