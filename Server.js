const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./database/connection');
const port = 3000;
const path = require('path');
const mainRouter = require('./Router/mainRouter');
const authRouter = require('./Router/authRouter');
const studentParentRouter = require('./Router/studentRouter');
const teacherRouter = require('./Router/teacherRouter');
const postRouter = require('./Router/postRouter');
const productRouter = require('./Router/productRouter');
const emailRouter = require('./Router/emailRouter');
const session = require('express-session');

app.use(session({
    secret: 'dknvsjdnvk',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

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
app.use('/',emailRouter);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
