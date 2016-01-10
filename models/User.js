var Sequelize = require('sequelize')
var Val = require("./ValidationUtils");
var crypto = require("crypto");

//Hash: SHA-224 generates a 224-bit hash value. You can use CHAR(56) or BINARY(28)

var crypto = require('crypto');

var SaltLength = 9;

function createHash(password) {
    var salt = generateSalt(SaltLength);
    var hash = hash(password + salt);
    return salt + hash;
}

function hash(string) {
    return crypto.createHash('sha224').update(string).digest('hex');
}

function validateHash(hash, password) {
    var salt = hash.substr(0, SaltLength);
    var validHash = salt + hash(password + salt);
    return hash === validHash;
}

function generateSalt(len) {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length,
        salt = '';
    for (var i = 0; i < len; i++) {
        var p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}

module.exports = function (db, models) {
    return db.define("User", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            username: {
                type: Sequelize.STRING(20),
                allowNull: false,
                validate: {
                    isAlphanumeric: Val.createObject([true], Val.notAlphanumeric("Username")),
                    len: Val.createObject([5, 20], Val.lengthError("Username", 5, 20))
                }
            },
            hash: {
                type: Sequelize.STRING(56),
                allowNull: false,
                validate: {len: [56, 56]}
            },
            salt: {
                type: Sequelize.STRING(14),
                allowNull: false,
                validate: {len: [14, 14]}
            },

            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                validate: {
                    isEmail: Val.createObject([true], Val.emailError())
                }
            },
            userType: {
                type: Sequelize.INTEGER,
                allowNull: true, defaultValue: null
            },
            careerId: {
                type: Sequelize.INTEGER,
                allowNull: true, defaultValue: null,
                references: {model: models.Career, key: "id"}
            },
            jobId: {
                type: Sequelize.INTEGER,
                allowNull: true, defaultValue: null,
                references: {model: models.Job, key: "id"}
            },

            currentSalary: {type: Sequelize.INTEGER}, //Slash trailing 1000?
            netWorth: {type: Sequelize.INTEGER}, //Slash trailing 1000 or range/scale?
        },
        {
            classMethods: {
                hash: createHash,
                validate: validateHash
            },

            //instanceMethods: {},

            indexes: [
                {
                    unique: true,
                    fields: ['username']
                },
                {
                    unique: true,
                    fields: ['email']
                }
            ]
        });
}