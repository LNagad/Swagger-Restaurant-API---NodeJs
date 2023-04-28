const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");
const DISH_CATEGORY = require("../enums/dishCategory");

const Dishes = sequelize.define("dishes", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  number_of_servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(...Object.values(DISH_CATEGORY)),
    allowNull: false,
  },
  //   ingredients,
});
module.exports = Dishes;
