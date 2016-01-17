var UUID = "UUID"; //UserId

module.exports.getUsername = function (req) {
    if (req.session !== undefined && req.session[UUID] !== undefined) {
        return req.session[UUID]
    }
    else
        return null;
}
module.exports.isLoggedIn = function (req) {

    if (req.session !== undefined && req.session[UUID] !== undefined) {
        return true;
    }
    else {
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


module.exports.setPageTitle = function (pageName, res) {
    res.locals["title"] = pageName;
}

module.exports.setLocalVariable = function (name, value, res) {
    res.locals[name] = value
}
