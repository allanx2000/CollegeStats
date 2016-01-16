var express = require('express');
var router = express.Router();
var State = require("../helpers/StateUtils");
var DAO = require("../helpers/DAO");

router.post('/addEducation', function (req, res, next) {
});

router.post('/editEducation', function (req, res, next) {
});

router.get('/addEducation', function (req, res, next) {
    res.render("editEducation", makeTemplate(req));
})

function makeTemplate(req, data) {
    var isEdit = data !== undefined;

    var locals = {
        title: isEdit ? "Edit" : "Add" + " Education",
    };

    if (isEdit) {
        DAO.getSchoolById(req, data.schoolId, function (r) {
            locals["school"] = r.name;

            return locals;
        });
    }
 }

router.post("/profile", function (req, res, next) {
    var id = State.getUsername(req)
    if (id === null)
        return res.redirect("/");

    DAO.updateUserData(req, id, function (errors) {
        //TODO: need to get old user and check emails?

        if (undefined !== errors) {
            //console.log("Update Error: " + JSON.stringify(errors))


            errs = []
            //TODO: make into util

            for (var i = 0; i < errors.length; i++) {
                errs.push(errors[i].message);
            }

            console.log(JSON.stringify(errs))
            renderProfilePage(req, res, false, errs);

        }
        else {
            renderProfilePage(req, res, true);
        }


    })
})

router.get("/profile", function (req, res, next) {
    renderProfilePage(req, res, false);
})


function renderProfilePage(req, res, updated, errors) {

    var user = State.getUsername(req)
    if (user === null)
        return res.redirect("/");

    DAO.getUserData(req, user, function (data) {
            console.log(JSON.stringify(data))
            State.setBasicPageName("My Profile", res)
            State.setLocalVariable("email", data.email, res)
            State.setLocalVariable("netWorth", data.netWorth, res)
            State.setLocalVariable("currentSalary", data.currentSalary, res)

            State.setLocalVariable("updated", updated, res)
            State.setLocalVariable("errors", errors, res)


            res.render("profile");
        },
        function (error) {
            console.log(JSON.stringify(error))
            res.send(error);
        }
    )
}


module.exports = router;
