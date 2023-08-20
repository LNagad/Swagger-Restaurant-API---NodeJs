require("dotenv").config();

const { Sequelize } = require("sequelize");

const DB_CNN = process.env.DB_CNN;

const sequelize = new Sequelize(DB_CNN, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Si estás teniendo problemas de autenticación SSL, ajusta esto a true
    },
  },
});

// const sequelize = new Sequelize("restaurantAPI", "postgres", DB_PASSW, {
//   dialect: "postgres",
//   port: 5432,
//   host: "localhost",
//   logging: false,
// });

// const sequelize = new Sequelize("restaurantAPI", "root", "", {
//   dialect: "mysql",
//   port: 3306,
//   host: "localhost",
//   logging: false,
// });

module.exports = sequelize;
