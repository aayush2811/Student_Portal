const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./database/connection');
const path = require('path');
const mainRouter = require('./Router/mainRouter');
const authRouter = require('./Router/authRouter');
const studentParentRouter = require('./Router/studentRouter');
const teacherRouter = require('./Router/teacherRouter');
const postRouter = require('./Router/postRouter');
const productRouter = require('./Router/productRouter');
const emailRouter = require('./Router/emailRouter');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION_STRING }),
    cookie: { secure: false }
}));

// Middleware to log session data
app.use((req, res, next) => {
    console.log('Session Data:', req.session);
    next();
});

// Set session data
app.get('/set-session', (req, res) => {
    req.session.testData = { foo: 'bar' };
    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).send('Error saving session');
        }
        res.send('Session data set');
    });
});

// Get session data
app.get('/get-session', (req, res) => {
    res.json(req.session.testData);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('/', mainRouter);
app.use('/', authRouter);
app.use('/', studentParentRouter);
app.use('/', teacherRouter);
app.use('/', postRouter);
app.use('/', productRouter);
app.use('/', emailRouter);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
