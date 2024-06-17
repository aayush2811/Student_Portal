exports.isStudent = (req, res, next) => {
    if (req.session.role === 'Student') {
        return next();
    }
    res.status(403).send('Access denied');
};

exports.isTeacher = (req, res, next) => {
    if (req.session.role === 'Teacher') {
        return next();
    }
    res.status(403).send('Access denied');
};

exports.isAdmin = (req, res, next) => {
    if (req.session.role === 'Admin') {
        return next();
    }
    res.status(403).send('Access denied');
};
