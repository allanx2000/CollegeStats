var Sequelize = require('sequelize')
var MAX_USER = 20
var MIN_USER = 5;
var HASH_LENGTH = 56;

module.exports = function(sequelize)
{
    var user

    models.User = db.define("User", {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            username: {
                type: Sequelize.STRING(MAX_USER),
                allowNull: false,
            },
            hash: {
                type: Sequelize.STRING(HASH_LENGTH),
                allowNull: false,
            },
            salt: {type: Sequelize.STRING(14),
                allowNull: false,
                validate: {len: [14, 14]}},
            email: {type: Sequelize.STRING(100),
                allowNull: false,
                validate: {isEmail: true}},
            userType: {type: Sequelize.INTEGER,
                allowNull: true, defaultValue: null},
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



    return user;
}