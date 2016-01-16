module.exports.getUserData = function (req, username, onResult, onError) {
    req.dbModels.User.findOne({where: {username: username}})
        .then(onResult)
        .catch(function (error) {
            if (onError !== undefined)
                onError(error)
        });
}

//TODO: Sequalize joins