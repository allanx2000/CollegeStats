var Val = require("./ValidationUtils");
var Validator = require("validator");

module.exports.getUserData = function (req, username, onResult, onError) {
    req.dbModels.User.findOne({where: {username: username}})
        .then(onResult)
        .catch(function (error) {
            if (onError !== undefined)
                onError(error)
        });
}


module.exports.updateUserData = function (req, username, onResult) {
    //console.log(JSON.stringify(values))

    var values = req.body;

    var update = {
        email: values.email,
        netWorth: parseInt(values.netWorth),
        currentSalary: parseInt(values.currentSalary)
    }

    req.dbModels.User.update(update, {where: {username: username}})
        .then(function (updated) {
            onResult()
        })
        .catch(function (errors) {
            onResult(errors)
        }
    )
}

module.exports.getSchoolById = function (req, id, onResult, onError) {
    req.dbModels.School.findOne({where: {id: id}})
        .then(onResult)
        .catch(function (error) {
            if (onError !== undefined)
                onError(error)
        });
}

//NOTE: SQLMaestro insert does not work....
/* Code for test insert
 var insert = "New York University";
 var school = req.dbModels.School.create(
 {
 name: insert,
 lname: insert.toLowerCase()
 })
 .then(function (model) { //Saved

 res.redirect("/");
 })
 .catch(function (err) {
 res.send();
 });
 */


module.exports.findSchools = function (req, search, onResult, onError) {

    //TODO: Add validator, find how to use
    //if (Val.lettersAndSpacesOnlyError(search))
    //    return onResult(null);

    var lower = search.toLowerCase();

    req.dbModels.School.findAll(
        {
            where: {lname: {$like: "%" + lower + "%"}},
            attributes: ["id", "name"]
        })
        .then(function (results) {
            console.log(results)
            onResult(results);
        })
        .catch(function (error) {
            console.log(error)
            if (onError !== undefined)
                onError(error)
        });
}
