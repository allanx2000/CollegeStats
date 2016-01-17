var express = require('express');
var router = express.Router();
var DAO = require("../helpers/DAO");
var SB = require("stringbuilder")

router.get('/findSchool', function (req, res, next) {
    var search = req.query.school;

    if (search.length < 3)
        return res.send(null);
    else if (search === undefined)
        return res.json(req.query);

    DAO.findSchools(req, search,
        function (results) {
            //console.log(results)
            res.json(results);
        },
        function (error) {
            //console.log(error)
            res.json(error)
        })
})

router.get('/findDegree', function (req, res, next) {
    var search = req.query.degree;

    if (search.length < 3)
        return res.send(null);
    else if (search === undefined)
        return res.json(req.query);

    DAO.findDegrees(req, search)
        .then(function (results) {
            //console.log(results)
            res.json(results);
        });
})


router.get('/test', function (req, res, next) {
    res.send("<p>test</p>")
})


module.exports = router;

