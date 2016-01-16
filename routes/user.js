var express = require('express');
var router = express.Router();
var State = require("../helpers/StateUtils");
var DAO = require("../helpers/DAO");

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


router.get("/profile", function (req, res, next) {

    var user = State.getUserId(req)
    if (user === null)
        return res.redirect("/");

    DAO.getUserData(req, user, function (data) {
            console.log(JSON.stringify(data))
            State.setBasicPageName("My Profile", res)
            State.setLocalVariable("email", data.email, res)
            State.setLocalVariable("netWorth", data.netWorth, res)
            State.setLocalVariable("currentSalary", data.currentSalary, res)

            res.render("profile");
        },
        function (error) {
            console.log(JSON.stringify(error))
            res.send(error);
        }
    )


})


module.exports = router;
