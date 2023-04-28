const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");
const TABLE_STATUS = require("../enums/tableStatus");

const Table = sequelize.define("tables", {
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(TABLE_STATUS)),
    allowNull: false,
    defaultValue: TABLE_STATUS.DISPONIBLE,
  },
});

module.exports = Table;
