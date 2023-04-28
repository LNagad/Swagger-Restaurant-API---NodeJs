const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");
const ORDER_STATUS = require("../enums/orderStatus");

const Order = sequelize.define("orders", {
  // table_id,
  // dishes_selected_id
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
    allowNull: false,
    defaultValue: ORDER_STATUS.EN_PROCESO,
  },
});

module.exports = Order;
