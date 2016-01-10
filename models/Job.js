var Sequelize = require('sequelize')
var Val = require("./ValidationUtils");

module.exports = function (db, models) {
    model = db.define("Job", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                validate: {
                    len: Val.createObject([5, 100], Val.lengthError("Job Title", 5, 100)),
                    is: Val.lettersAndSpacesOnly("Job Title")
                }
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['name']
                }
            ]
        });

    return model;
}