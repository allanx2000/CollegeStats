var Sequelize = require('sequelize')
var Val = require("./ValidationUtils");

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