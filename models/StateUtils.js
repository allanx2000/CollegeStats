var UUID = "UUID"; //UserId

module.exports.isLoggedIn = function (req) {

    if (req.session !== undefined && req.session[UUID] !== undefined) {
        console.log("LoggedIn")
        return true;
    }
    else {
        console.log("Not LoggedIn: " + req.session)

        return false;
    }
}

module.exports.login = function (userInfo, req) {
    req.session["UUID"] = userInfo.username;
    req.session.save();
}

module.exports.logout = function (req) {
    req.session["UUID"] = undefined;
    req.session.save();
}

module.exports.setBasicPageName = function (pageName, res) {
    res.locals["title"] = pageName;
}

module.exports.setLocalVariable = function (name, value, res) {
    res.locals[name] = value
}
