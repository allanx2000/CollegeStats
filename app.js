//App/Server Configuration

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
//External Controllers/Routes
var routes = require('./routes/root');
var user = require('./routes/user');

var ValidatorUtil = require('./helpers/ValidationUtils');
var Sequelize = require('sequelize')
var State = require("./helpers/StateUtils");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var IS_PROD = process.env === "production";

//DB
var db;

if (!IS_PROD) {
    db = new Sequelize("db", "dbUser", "dbPassword", {
        host: "localhost",
        dialect: "sqlite",

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },

        // SQLite only
        storage: 'c:/DEV/collegeStat.sqlite'
    });
}
else {
    db = new Sequelize('postgres://user:pass@example.com:5432/dbname');
}

//Models
var models = {};

models.Job = require("./models/Job")(db, models);
models.Career = require("./models/Career")(db, models);
models.User = require("./models/User")(db, models);

var Education = require("./models/Education")
models.School = Education.school(db, models);
models.DegreeType = Education.degreeType(db, models);
models.Degree = Education.degree(db, models);
models.Education = Education.education(db, models);

db.sync().then(function () {
    console.log("Created")
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//TODO: Put these into a Configuration function or separate file (make a generator I guess)
var sessionConfig = {
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: 3 * 24 * 60 * 60000}, //60,000 = 1min
    secret: "as09fidf274",
    resave: true, //TODO: need to check https://github.com/expressjs/session#options
    saveUninitialized: false,
};

app.use(session(sessionConfig));

/*app.use(require("less-middleware"))(
 {
 src: __dirname + "/public",
 compress: true
 }
 )*/

//Must be at end
app.use(function (req, res, next) {
    req.db = db;
    req.dbModels = models;
    req.validator = ValidatorUtil;

    res.locals = {}

    //Check logged in
    State.setLocalVariable("user", State.getUserId(req), res)

    next();
});


//Routers and Paths
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/test/:username', function (req, res, next) {
    res.send(req.params.username);
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!IS_PROD) {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
