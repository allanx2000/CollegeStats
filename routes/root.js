var express = require('express');
var router = express.Router();

var User = require('./../models/User')
var Hashing = require('./../helpers/HashUtils')
var State = require('./../helpers/StateUtils')
var DAO = require('./../helpers/DAO');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


function processRegistration(req, res, next) {

    var errors = [];

    if (req.body.pwd != req.body.cpwd)
        errors.push("The passwords do not match");

    var salt = Hashing.generateSalt();
    console.log(salt);
    var hash = Hashing.createHash(req.body.pwd, salt)
    console.log(hash);

    var user = req.dbModels.User.create(
        {
            username: req.body.username,
            email: req.body.email,
            hash: hash,
            salt: salt,
        })
        .then(function (model) { //Saved

            res.redirect("/");
            //TODO: Change to confirmation page
            //TODO: Send email
        })
        .catch(function (err) {
            var err = req.validator.stripDetails(err.errors);
            errors = errors.concat(err);

            console.log("General: " + JSON.stringify(errors, null, 2));

            returnRegistrationError(req, res, errors);
        });
}

function returnRegistrationError(req, res, errors) {
    var vals = getLocalsForRegister(req.body, errors);
    vals["errors"] = errors;

    res.render("register", vals);
}


//Routes
router.post('/register', processRegistration);

router.get('/register', function (req, res, next) {

    if (State.isLoggedIn(req))
        res.redirect("/profile");

    res.render("register", getLocalsForRegister());
});

function getLocalsForRegister(prev) {
    return {
        title: "Register",
        email: prev === undefined ? "" : prev.email,
        username: prev === undefined ? "" : prev.username,
    }
}

router.get('/login', function (req, res, next) {
    if (State.isLoggedIn(req))
        res.redirect("/profile");

    res.render('login', {title: "Login"})
})

router.post('/login', function (req, res, next) {
    var pwd = req.body.pwd;
    var user = req.body.username;

    DAO.getUserData(req, user, function (info) {
        var hasError = false;

        if (info === null || !Hashing.validateHash(info.hash, info.salt, pwd)) {
            State.setLocalVariable("error", "The username or password is incorrect", res);
            hasError = true;
        }
        else if (info.userType === null) {
            State.setLocalVariable("notVerified", true, res);
            hasError = true;
        }

        if (!hasError) {
            State.login(info, req);
            res.redirect("/");
        }
        else {
            res.render("login");
        }
    });
});

router.get('/logout', function (req, res, next) {
    if (State.isLoggedIn(req))
        State.logout(req)

    return res.redirect("/");
});


//TODO: Remove
router.get("/session", function (req, res, next) {

    res.json(req.session)
})




module.exports = router;
