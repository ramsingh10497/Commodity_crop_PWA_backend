const Sequelize = require("sequelize")
const dbConfig = require("../config/database")

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operationsAliases: false,
	pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {
    sequelize: sequelize
}

const Users = require("./user.model")(sequelize, Sequelize)
const Crops = require("./crop.model")(sequelize, Sequelize)
const Reports = require("./report.model")(sequelize, Sequelize)

// Crops.hasMany(Reports, {foreignKey: "cropId", as: "reports"});
Reports.belongsTo(Crops, { foreignKey: "cropId", as: "crop" })
Reports.belongsTo(Users, { foreignKey: "userId", as: "user" })


db.users = Users
db.crops = Crops
db.reports = Reports

module.exports = db;
// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
// });
