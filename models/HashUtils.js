var Sequelize = require('sequelize')
var crypto = require('crypto');

//Hash: SHA-224 generates a 224-bit hash value. You can use CHAR(56) or BINARY(28)

//TODO: Need to move this functions into own model function
var SALT_LENGTH = 14;

module.exports.saltLength = SALT_LENGTH;

module.exports.createHash = function (password, salt) {
    var hash = makeHash(password + salt);
    return hash;
}

function makeHash(string) {
    return crypto.createHash('sha224').update(string).digest('hex');
}

module.exports.validateHash = function (hash, salt, password) {
    var validHash = makeHash(password + salt);
    return hash === validHash;
}

module.exports.generateSalt = function () {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length,
        salt = '';
    for (var i = 0; i < SALT_LENGTH; i++) {
        var p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}
