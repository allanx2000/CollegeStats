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
            console.log(results)
            res.json(results);
        },
        function (error) {
            res.json(error)
        })
})

/*
 router.get('/findSchool', function (req, res, next) {

 var search = req.query.school;

 if (search.length < 3)
 return res.send();
 else if (search === undefined)
 return res.send(JSON.stringify(req.query));

 var results = ["A", "B", "C", "D"]

 var sb = new SB({newline:'\r\n'})

 sb.appendLine("<table id='res_school' class='table table-hover'>")

 for (var i = 0; i < results.length; i++)
 {
 var text = "Hello " + results[i];
 var cmd = 'setSchool("' + text + '")';

 sb.appendLine("<tr onclick='" + cmd + "'><td><p>" + text + "</td></tr>")
 }

 sb.appendLine("</table>")

 sb.toString(function(err, str)
 {
 console.log(str)
 res.send(str);
 })
 })
 */

router.get('/test', function (req, res, next) {
    res.send("<p>test</p>")
})


module.exports = router;

