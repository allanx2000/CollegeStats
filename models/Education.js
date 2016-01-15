var Sequelize = require('sequelize')
var Val = require("./ValidationUtils");

//School
module.exports.school = function (db, models) {
    var model = db.define("School", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['name']
                }]
        });

    return model;
}


//Education
module.exports.education = function (db, models) {
    var model = db.define("Education", {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: models.User, key: "id"}
            },
            graduated: {
                type: Sequelize.INTEGER(4),
                allowNull: false,
            },
            schoolId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: models.School, key: "id"}
            },
            degreeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: models.DegreeType, key: "id"}
            },
            major1: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: models.Degree, key: "id"}
            },
            major2: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {model: models.Degree, key: "id"}
            },
            minor: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {model: models.Degree, key: "id"}
            }
        }
        /*
         {
         indexes: [
         {
         unique: true,
         fields: ['name']
         }
         ]*/
    );

    return model;
}

//Degree
module.exports.degreeType = function (db, models) {
    var model = db.define("DegreeType", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
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

//Field
module.exports.degree = function (db, models) {
    var model = db.define("Degree", {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
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
