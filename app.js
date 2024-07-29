var express = require('express');
var app = express();


const con = require('./database/db');
const router = require('./controller/router')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(cookieParser());
app.use(
    session({
        key: "user_sid",
        secret: "somerandomstuff",
        resave: false,
        saveUninitialized: false,
        cookie:{
            expires: 1000,
        },
    })
);


app.use(express.static('views'));
const path = require('path');
app.use(express.static(path.join(__dirname, '/uploads')));
app.use('/', router);
app.listen(4230)