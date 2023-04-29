const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");
const ROLES = require("../enums/roles");

const User = sequelize.define("users", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false,
  },
});
module.exports = User;
