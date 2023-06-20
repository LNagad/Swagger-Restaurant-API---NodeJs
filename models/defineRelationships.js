const sequelize = require("../database/connection");

const ingredient = require("./ingredient");
const dishes = require("./dish");
const table = require("./table");
const order = require("./order");
const user = require("./user");

const defineRelationships = async () => {
  // Definir la relación many-to-many
  dishes.belongsToMany(ingredient, { through: "DishIngredient" });
  ingredient.belongsToMany(dishes, { through: "DishIngredient" });

  table.hasMany(order);
  order.belongsTo(table);

  dishes.belongsToMany(order, { through: "DishOrder" });
  order.belongsToMany(dishes, { through: "DishOrder" });

  await sequelize.sync({ alter: true });
};

module.exports = defineRelationships;
