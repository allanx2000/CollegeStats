var express = require('express');
var router = express.Router();
var State = require("../helpers/StateUtils");

router.post('/addEducation', function (req, res, next) {
});

router.post('/editEducation', function (req, res, next) {
});

router.get('/addEducation', function (req, res, next) {
    res.render("editEducation", makeTemplate());
})
/*
 function makeTemplate(data)
 {
 var isEdit = data === undefined;

 return
 {
 title: isEdit ? "Edit" : "Add" + " Education",
 school: isEdit ? //Make a DAO Class
 }
 }*/

module.exports = router;
