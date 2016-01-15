var express = require('express');
var router = express.Router();

/* GET users listing matching criteria*/
router.post('/', function(req, res, next) {
    s.send('respond with a resource');
});

//For Testing
//Real one should just be static url load with logged in user (PRofile page)
router.get('/:id', function(req, res, next) {

    //TODO: if not logged in, seesion == null, reject
    //
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
