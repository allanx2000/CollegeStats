
module.exports.notAlphanumeric = function(name)
{
    return name + " can only contain letters and numbers";
}

module.exports.lengthError = function(name, min, max)
{
    return name + " must be between " + min + " and " + max + " characters";
}

module.exports.stripDetails = function(errors) {
    //errors is Array
    msgs = [];

    console.log(errors.length)
    for (var i = 0; i < errors.length; i++)
    {
        var item = errors[i];

        if (typeof(item) === "string")
            msgs.push(item)
        else //Is validator error
            msgs.push(item.message);
    }
    console.log(msgs);
    return msgs;
};