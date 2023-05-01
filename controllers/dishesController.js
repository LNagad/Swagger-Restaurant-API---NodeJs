const dishes = require("../models/dish");
const ingredientsModel = require("../models/ingredient");
const { validationResult } = require("express-validator");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { name, price, servings, ingredients, category } = req.body;

    const result = await dishes.create({
      name,
      price,
      number_of_servings: servings,
      category,
    });

    // Guardar los ingredientes relacionados con el plato

    await Promise.all(
      ingredients.new.map(async (ingredient) => {
        const foundIngredient = await ingredientsModel.findByPk(ingredient);
        if (foundIngredient) {
          await result.addIngredient(foundIngredient);
        }
      })
    );

    result.ingredients = await result.getIngredients({ raw: true });

    res.status(201).json({
      ok: true,
      message: "Dish has been created!",
      result: { ...result.dataValues, ingredients: result.ingredients },
    });
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
    const { name, price, servings, ingredients, category } = req.body;

    const dishId = req.params.dishId;

    const dishFound = await dishes.findByPk(dishId);

    if (!dishFound) {
      const error = new Error("Dish was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    dishFound.name = name;
    dishFound.price = price;
    dishFound.number_of_servings = servings;
    dishFound.category = category;

    const result = await dishFound.save();

    const [newIngredients, oldIngredients] = await Promise.all([
      ingredientsModel.findAll({ where: { id: ingredients.new } }),
      ingredientsModel.findAll({ where: { id: ingredients.old } }),
    ]);

    await Promise.all([
      result.removeIngredients(oldIngredients),
      result.setIngredients(newIngredients),
    ]);

    result.ingredients = await result.getIngredients({ raw: true });

    res.status(200).json({
      ok: true,
      message: "Dish has been updated!",
      result: { ...result.dataValues, ingredients: result.ingredients },
    });
  } catch (error) {
    next(error);
  }
};

exports.partialUpdate = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }
    const { name, price, servings, ingredients, category } = req.body;

    const dishId = req.params.dishId;

    const dishFound = await dishes.findByPk(dishId);

    if (!dishFound) {
      const error = new Error("Dish was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    dishFound.name = name || dishFound.name;
    dishFound.price = price || dishFound.price;
    dishFound.number_of_servings = servings || dishFound.number_of_servings;
    dishFound.category = category || dishFound.category;

    const result = await dishFound.save();

    if (ingredients.new && ingredients.new.length >= 1) {
      await result.addIngredient(ingredients.new);
    }

    if (ingredients.old && ingredients.old.length >= 1) {
      await result.removeIngredients(ingredients.old);
    }

    result.ingredients = await result.getIngredients({ raw: true });

    res.status(200).json({
      ok: true,
      message: "Dish has been updated!",
      result: { ...result.dataValues, ingredients: result.ingredients },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const result = await dishes.findAll();

    const mappedResult = await Promise.all(
      result.map(async (p) => {
        const ingredients = await p.getIngredients({ raw: true });
        return {
          ...p.dataValues,
          ingredients,
        };
      })
    );

    res.status(200).json({
      ok: true,
      result: mappedResult,
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

    const dishFound = await dishes.findByPk(dishId);

    if (!dishFound) {
      const error = new Error("Dish was not found.");
      error.statusCode = 404;
      throw error;
    }

    dishFound.ingredients = await dishFound.getIngredients({ raw: true });

    res.status(200).json({
      ok: true,
      result: {
        ...dishFound.dataValues,
        ingredients: dishFound.ingredients,
      },
    });
  } catch (error) {
    next(error);
  }
};
