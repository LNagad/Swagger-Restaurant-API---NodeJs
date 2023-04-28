const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");

const Ingredient = sequelize.define("ingredients", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Ingredient;
