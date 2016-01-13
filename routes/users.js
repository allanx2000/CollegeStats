var express = require('express');
var router = express.Router();
var User = require('./../models/User')
var HashUtils = require('./../models/HashUtils')


/* GET users listing matching criteria*/
router.post('/', function(req, res, next) {
    s.send('respond with a resource');
});

router.post('/register', processRegistration);

//TODO: Need to generate to test
//TODO: Validation logic must be separate from cb model... store helpers in the model.js for this validation as well
function getHash (string) {
    return string;
};

function getSalt(string) {
    return string;
};

function processRegistration(req, res, next) {

    var errors = [];

    if (req.body.pwd != req.body.cpwd)
        errors.push("The passwords do not match");

    var salt = HashUtils.generateSalt();
    console.log(salt);
    var hash = HashUtils.createHash(req.body.pwd, salt)
    console.log(hash);

    var user = req.dbModels.User.create(
            {
                username: req.body.username,
                email: req.body.email,
                hash: hash,
                salt: salt,
            })
            .then(function (model) {
                //Already saved
            res.redirect("/"); //TODO: Change to confirmation page
            })
            .catch(function(err)
            {
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

//NOTE: Order matters
router.get('/register', function(req, res, next)
{
    //if logged in, redirect?
    res.render("register", {title: "Register"});
});

//TODO: Add session state and user info to req?

router.get('/:id', function(req, res, next) {

    //TODO: if not logged in, seesion == null, reject
    //TODO: Add middleware for expressions
    req.dbModels.User.findOne({where: {id: req.params.id}})
        .then(function(user) {
            if (user === null)
                return next(new Error("User not found")) //NOTE: Important to use return otherwise it falls though
            //TODO: Check numeric or not even should allow user lookup by ID, except for self

            res.json(user);
        }
    );
});



module.exports = router;
