//App/Server Configuration

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ValidatorUtil = require('./models/ValidationUtils');

//External Controllers/Routes
var routes = require('./routes/index');
var users = require('./routes/users');

var Sequelize = require('sequelize')

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

//SQL loader

//TODO: Load Models?
/*
 // in your server file - e.g. app.js
 var Project = sequelize.import(__dirname + "/path/to/models/project")

 // The model definition is done in /path/to/models/project.js
 // As you might notice, the DataTypes are the very same as explained above
 module.exports = function(sequelize, DataTypes) {
 return sequelize.define("Project", {
 name: DataTypes.STRING,
 description: DataTypes.TEXT
 */

var models = {};

//TODO: Move to External
models.Job = db.define("Job", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING(100)} //Not created why
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['name']
            }
        ]
    });

models.Career = db.define("Career", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING(100), allowNull: false}
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['name']
            }
        ]
    });

models.User = db.define("User", {

        //TODO: Add Mapping relationship and table from User to Degree/Universities
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        username: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {
                isAlphanumeric: {
                    args: [true],
                    msg: ValidatorUtil.notAlphanumeric("Username")
                },
                len: {
                    args: [5, 20],
                    msg: ValidatorUtil.lengthError("Username", 5, 20)
                }
            }
        },
        hash: {
            type: Sequelize.STRING(56),
            allowNull: false,
            validate: {len: [56, 56]}
        },
        salt: {type: Sequelize.STRING(14),
            allowNull: false,
            validate: {len: [14, 14]}},
        email: {type: Sequelize.STRING(100),
            allowNull: false,
            validate: {isEmail: true}},
        userType: {type: Sequelize.INTEGER,
            allowNull: true, defaultValue: null},
        careerId: {
            type: Sequelize.INTEGER,
            allowNull: true, defaultValue: null,
            references: {model: models.Career, key: "id"}
        },
        jobId: {
            type: Sequelize.INTEGER,
            allowNull: true, defaultValue: null,
            references: {model: models.Job, key: "id"}
        },

        currentSalary: {type: Sequelize.INTEGER}, //Slash trailing 1000?
        netWorth: {type: Sequelize.INTEGER}, //Slash trailing 1000 or range/scale?
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['username']
            },
            {
                unique: true,
                fields: ['email']
            }
        ]
    });

db.sync().then(function () {
    console.log("Created")
});

app.use(function (req, res, next) {
    req.db = db;
    req.dbModels = models;
    req.validator = ValidatorUtil;
    next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Routers and Paths
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
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
