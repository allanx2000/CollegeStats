module.exports.emailError = function () {
    return "The email entered is invalid"
};

module.exports.notAlphanumeric = function(name)
{
    return name + " can only contain letters and numbers";
}

module.exports.lengthError = function(name, min, max)
{
    return name + " must be between " + min + " and " + max + " characters";
}

module.exports.createObject = function (args, message) {
    return {args: args, msg: message};
}

module.exports.lettersAndSpacesOnlyError = function (name) {
    var val = module.exports.createObject(["/^[a-zA-Z\s]*$/"], name + "can only contain letters and numbers");
    return val;
}


module.exports.stripDetails = function (arrayOfErrors) {
    //errors is Array of Objects containing message

    msgs = [];

    for (var i = 0; i < arrayOfErrors.length; i++)
    {
        var item = arrayOfErrors[i];
        msgs.push(item.message);
    }

    return msgs;
};