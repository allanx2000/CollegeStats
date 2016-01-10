module.exports.emailError = function () {
    return "The email entered is invalid."
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

module.exports.stripDetails = function(errors) {
    //errors is Array of Objects containing message

    msgs = [];

    for (var i = 0; i < errors.length; i++)
    {
        var item = errors[i];

        /*if (typeof(item) === "string")
            msgs.push(item)
        else //Is validator error
         */

        msgs.push(item.message);
    }

    return msgs;
};