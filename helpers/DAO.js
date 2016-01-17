var Val = require("./ValidationUtils");
var Validator = require("validator");

//TODO: Need to change these to just retun the Promise?
module.exports.getUserData = function (req, username, onResult, onError) {
    doQuery(req.dbModels.User.findOne({where: {username: username}}),
        onResult, onError)
}


module.exports.updateUserData = function (req, username, onResult) {
    var values = req.body;

    var update = {
        email: values.email,
        netWorth: parseInt(values.netWorth),
        currentSalary: parseInt(values.currentSalary)
    }

    doQuery(req.dbModels.User.update(update, {where: {username: username}}),
        function (count) {
            onResult()
        },
        onResult
    );
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

module.exports.getSchoolByName = function (req, name) {
    if (!hasValue(name))
        return null;

    return req.dbModels.School.findOne({where: {lname: name.toLowerCase()}});

}

function hasValue(data) {
    if (null === data || undefined === data)
        return false;
    else
        return true;

}

module.exports.getDegreeByName = function (req, name) {

    if (!hasValue(name))
        return null;

    return req.dbModels.Degree.findOne({where: {lname: name.toLowerCase()}});
}

/*
 module.exports.getSchoolByName = function(req, name, onData, onError, next)
 {
 doQuery(
 req.dbModels.School.findOne({where: {lname: name.toLowerCase()}}),
 onData,
 onError,
 next
 )

 }


 module.exports.getDegreeByName = function(req, name,onData, onError, next)
 {
 doQuery(
 req.dbModels.Degree.findOne({where: {lname: name.toLowerCase()}}),
 onData,
 onError,
 next
 )

 }
 */

module.exports.findDegrees = function (req, search, onResult, onError, next) {

    var lower = search.toLowerCase();

    return req.dbModels.Degree.findAll(
        {
            where: {lname: {$like: "%" + lower + "%"}},
            attributes: ["id", "name"],
            limit: 10,
            order: [["lname", "ASC"]]
        });
}


module.exports.findSchools = function (req, search, onResult, onError, next) {

    var lower = search.toLowerCase();

    doQuery(
        req.dbModels.School.findAll(
            {
                where: {lname: {$like: "%" + lower + "%"}},
                attributes: ["id", "name"],
                limit: 10,
                order: [["lname", "ASC"]]
            })
        ,
        function (results) {
            //console.log(results)
            onResult(results);
        },
        function (error) {
            //console.log(error)
            onError(error)
        },
        next
    )

}

function doQuery(query, onData, onError, next) {
    query
        .then(function (data) {
            onData(data)

            if (typeof(next) === "function")
                next();
        })
        .catch(function (error) {

            //onError(error)
            if (typeof(next) === "function")
                next();
        })
}


/*
module.exports.findSchools = function (req, search, onResult, onError) {

    //TODO: Add validator, find how to use
    //if (Val.lettersAndSpacesOnlyError(search))
    //    return onResult(null);

    var lower = search.toLowerCase();

    //TODO: Add more details
    req.dbModels.School.findAll(
        {
            where: {lname: {$like: "%" + lower + "%"}},
 attributes: ["id", "name"],
 limit: 10,
 order: [["lname", "ASC"]]
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
 */