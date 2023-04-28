require("dotenv").config();

const { Sequelize } = require("sequelize");

const DB_PASSW = process.env.DB_PASSW;

const sequelize = new Sequelize("restaurantAPI", "postgres", DB_PASSW, {
  dialect: "postgres",
  port: 5432,
  host: "localhost",
  logging: false,
});

// const sequelize = new Sequelize("restaurantAPI", "root", "", {
//   dialect: "mysql",
//   port: 3306,
//   host: "localhost",
//   logging: false,
// });

module.exports = sequelize;
