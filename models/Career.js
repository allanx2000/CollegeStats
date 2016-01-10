var Sequelize = require('sequelize')
var Val = require("./ValidationUtils");

module.exports = function (db, models) {
    var model = db.define("Career", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                validate: {
                    len: Val.createObject([5, 100], Val.lengthError("Career", 5, 100)),
                    is: Val.lettersAndSpacesOnly("Career")
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