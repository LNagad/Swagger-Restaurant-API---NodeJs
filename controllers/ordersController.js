const Orders = require("../models/order");
const Dishes = require("../models/dish");
const { validationResult } = require("express-validator");
const TABLE_STATUS = require("../enums/tableStatus");
const ORDER_STATUS = require("../enums/orderStatus");

exports.getAll = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const result = await Orders.findAll();

    const resultMapped = await Promise.all(
      result.map(async (p) => {
        return {
          ...p.dataValues,
          dishes: await p.getDishes(),
        };
      })
    );

    res.status(200).json({
      ok: true,
      result: resultMapped,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const dishId = req.params.dishId;

    const dishFound = await Orders.findByPk(dishId);

    if (!dishFound) {
      const error = new Error("Dish was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    dishFound.dishesOrdered = await dishFound.getDishes();

    res.status(200).json({
      ok: true,
      result: { ...dishFound.dataValues, dishes: dishFound.dishesOrdered },
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { tableId, dishes } = req.body;

    const order = await Orders.create({
      subtotal: 1,
      tableId: tableId,
      status: ORDER_STATUS.EN_PROCESO,
    });

    const dishesToAdd = await Dishes.findAll({ where: { id: dishes } });
    await order.addDishes(dishesToAdd);

    order.dishesOrdered = await order.getDishes();

    const subtotalDishes = order.dishesOrdered.reduce(
      (acc, dish) => acc + dish.price,
      0
    );

    order.subtotal = subtotalDishes;
    await order.save();

    const responseData = {
      ok: true,
      message: "Order has been created successfully!",
      order: { ...order.dataValues, dishes: order.dishesOrdered },
    };

    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { dishes } = req.body;

    const dishId = req.params.dishId;

    const dishFound = await Orders.findByPk(dishId);

    if (!dishFound) {
      const error = new Error("Dish was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    const newDishes = await Dishes.findAll({ where: { id: dishes } });

    await dishFound.removeDishes();
    await dishFound.setDishes(newDishes);

    const subtotal = newDishes.reduce((acc, dish) => acc + dish.price, 0);
    dishFound.subtotal = subtotal;

    const result = await dishFound.save();

    result.dishes = await result.getDishes({ raw: true });

    res.status(200).json({
      ok: true,
      message: "Dish has been updated!",
      result: { ...result.dataValues, dishes: result.dishes },
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const dishId = req.params.dishId;

    const dishFound = await Orders.findByPk(dishId);

    if (!dishFound) {
      const error = new Error("Dish was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }
    await dishFound.removeDishes();

    await dishFound.destroy();

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
