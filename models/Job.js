var Sequelize = require('sequelize')
var Val = require("./../helpers/ValidationUtils");

module.exports = function (db, models) {
    model = db.define("Job", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                validate: {
                    len: Val.createObject([5, 100], Val.lengthError("Job Title", 5, 100)),
                    is: Val.lettersAndSpacesOnlyError("Job Title")
                }
            },
            lname: {
                type: Sequelize.STRING(150),
                allowNull: false,   //TODO: add length validation
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['lname']
                }
            ]
        });

    return model;
}