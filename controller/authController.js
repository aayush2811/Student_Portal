const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
let otpStore = {};

const adminCredentials = {
    email: 'admin@gmail.com',
    password: 'admin@123',
    role: 'Admin'
};

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.render('page_login', { error: 'Invalid email address' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        otpStore[email] = otp;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email');
            }
            res.render('otpVerify', { email });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (otpStore[email] === otp) {
        if (newPassword !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await UserModel.findOne({ email });
        if (user) {
            user.password = hashedPassword;
            await user.save();
            delete otpStore[email];
            return res.redirect('/page_login');
        }
        return res.status(400).send('User not found');
    }
    res.status(400).send('Invalid OTP');
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const token = jwt.sign({ email, role }, "vjdnsvks", { expiresIn: "1h" });

        const data = await new UserModel({
            username,
            email,
            password,
            role,
            token
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        data.password = hashedPassword;
        data.token = token;
        await data.save();
        res.redirect('/page_login');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (email === adminCredentials.email && password === adminCredentials.password && role === adminCredentials.role) {
            req.session.userId = 'admin-static-id';
            req.session.role = 'Admin';
            const redirectTo = req.session.redirectTo || '/index';
            delete req.session.redirectTo;
            return res.redirect(redirectTo);
        }

        let user = await UserModel.findOne({ email, role });

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;
        const redirectTo = req.session.redirectTo || '/index';
        delete req.session.redirectTo;
        res.redirect(redirectTo);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('edit_profile', { user });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(400).send('User ID not found in session');
        }

        const { name, surname, specialty, skills, gender, birth, phone, email, country, city } = req.body;
        
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            name,
            surname,
            specialty,
            skills,
            gender,
            birth,
            phone,
            email,
            country,
            city
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.redirect('/edit_profile');
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send('Server error');
    }
};
