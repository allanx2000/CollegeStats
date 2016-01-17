var express = require('express');
var router = express.Router();
var State = require("../helpers/StateUtils");
var DAO = require("../helpers/DAO");

var Promise = require("bluebird");


router.post('/addEducation', function (req, res, next) {


    //TODO: Input Validation, including the ones currently added by default


    var SCHOOL = "school";
    var MAJOR1 = "major1";
    var MAJOR2 = "major2";
    var MINOR = "minor";

    var lookupMap = [
        SCHOOL,
        MAJOR1
    ];

    var daoCalls = [
        DAO.getSchoolByName(req, req.body.school),
        DAO.getDegreeByName(req, req.body.major1)
    ];

    if (req.body.major2 != "") {
        lookupMap.push(MAJOR2)
        daoCalls.push(DAO.getDegreeByName(req, req.body.major2))
    }

    if (req.body.minor != "") {
        lookupMap.push(MINOR)
        daoCalls.push(DAO.getDegreeByName(req, req.body.minor))
    }

    var finalValues = {};

    var processResult = function (results, lookup, promisesToExecute, final) {


        if (promisesToExecute.length > 0) {
            Promise.all(promisesToExecute).then(function (r2) {
                processResult(r2, lookup, [], final);
            });
        }
        else {

            var l_length = lookup.length;

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var key = lookup[i];

                console.log("KEY: " + key)

                if (key === SCHOOL) {
                    if (result === null)
                        return res.send("School not found")
                    else
                        final[key] = result.id;
                }
                else if (key === MAJOR1) {
                    console.log("MAJOR1" + JSON.stringify(result))

                    if (result === null) {
                        promisesToExecute.push(
                            req.dbModels.Degree.create(
                                {
                                    name: req.body.major1,
                                    lname: req.body.major1.toLowerCase()
                                }
                            ));
                        lookup.push(MAJOR1);
                    }
                    else {
                        final[key] = result.id;
                    }
                }
                else if (key === MAJOR2) {
                    console.log("MAJOR2" + JSON.stringify(result))
                    if (result === null) {
                        promisesToExecute.push(
                            req.dbModels.Degree.create(
                                {
                                    name: req.body.major2,
                                    lname: req.body.major2.toLowerCase()
                                }
                            ));
                        lookup.push(MAJOR2);
                    }
                    else
                        final[key] = result.id;
                }
            }

            lookup.splice(0, l_length)

            if (promisesToExecute.length == 0) {
                res.json(final);
            }
            else
                processResult(null, lookup, promisesToExecute, final)
        }
    }

    processResult(null, lookupMap, daoCalls, finalValues);

    /*
     Promise.all(daoCalls)
     .then(function (results) {

     for (var i = 0; i < results.length; i++) {
     var result = results[i];
     var key = lookupMap[i];

     if (key === SCHOOL) {
     if (result === null)
     return res.send("School not found")
     else
     finalValues[key] = result.id;
     }
     else if (key === MAJOR) {
     if (result === null)
     return res.send("Major not found")
     else
     finalValues[key] = result.id;
     }
     }

     var lm2 = [];
     var p2 = []
     if (results[1] === null)


     res.json(data);
     })*/
})

/*
 router.post('/addEducation', function (req, res, next) {

 //TODO: Validate
 var values = {};

 var doPromise = function (promise, name, saveAs) {
 return promise(req, name)
 .then(function (data) {
 if (data === null)
 return res.send("school not found");
 else
 values[saveAs] = data.id;
 })
 }


 var params = req.body;
 if (params.school.length < 3) //TODO: Check min max length of all fields pre query
 return res.send("School is required")

 DAO.getSchoolByName(req, req.body.school)
 .then(function (data) {
 if (data === null)
 return res.send("school not found");
 else {
 values["school"] = data.id;

 DAO.getDegreeByName(req, req.body.major1)
 .then(function (data) {
 if (data === null)
 req.dbModels.Degree
 .create({name: req.body.major1, lname: req.body.major1.toLowerCase()})
 .then(function (model) {
 values["major1"] = model.id;
 res.json(values)
 }
 )
 else {
 values["major1"] = data.id;
 res.json(values)
 }
 }
 );
 }
 })
 });
 */

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
    else
        return locals;
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
            State.setPageTitle("My Profile", res)
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
