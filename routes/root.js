var express = require('express');
var router = express.Router();

var User = require('./../models/User')
var Hashing = require('./../models/HashUtils')
var State = require('./../models/StateUtils')

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

    res.locals =
    {
        previous: req.body,
        errors: errors
    }
    res.render("register", {title: "Register"});
}


router.post('/register', processRegistration);

//NOTE: Order matters
router.get('/register', function (req, res, next) {
    //if logged in, redirect?
    res.render("register", State.setBasicPageName("Register", res));
});

router.get('/login', function (req, res, next) {
    //TODO: Check logged in

    res.render('login', {title: "Login"})
})

//TODO: Remove
router.get("/session", function (req, res, next) {
    res.json(req.session)
})

router.get('/logout', function (req, res, next) {

    if (State.isLoggedIn(req))
        State.logout(req)

    return res.redirect("/");
});


router.post('/login', function (req, res, next) {
    var pwd = req.body.pwd;
    var user = req.body.username;

    req.dbModels.User.findOne({where: {username: user}})
        .then(function (info) {
            if (info === null)
                return next(new Error("User not found")) //NOTE: Important to use return otherwise it falls though

            var valid = Hashing.validateHash(info.hash, info.salt, pwd);

            if (valid) {
                State.login(info, req);

                res.redirect("/");
            }
            else
                res.redirect("/login"); //TODO: Error handling
        })
});


module.exports = router;
