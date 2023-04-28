const defineRelationships = require("../models/defineRelationships");
const sequelize = require("./connection");

exports.authenticateDb = async () => {
  try {
    await sequelize.authenticate();

    console.log("Connection has been established successfully.");

    await defineRelationships();

    console.log("Database synchronized successfully.");
  } catch (error) {
    console.log(error);

    return Promise.reject(error);
  }
};
