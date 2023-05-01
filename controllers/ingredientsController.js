const ingredients = require("../models/ingredient");
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

    const name = req.body.name;

    const result = await ingredients.create({ name: name });

    res.status(201).json({
      ok: true,
      message: "Ingredient has been created!",
      result,
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

    const name = req.body.name;
    const ingredientId = req.params.ingredientId;

    const ingredientFound = await ingredients.findByPk(ingredientId);

    if (!ingredientFound) {
      const error = new Error("Ingredient was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    ingredientFound.name = name;

    const result = await ingredientFound.save();

    res.status(200).json({
      ok: true,
      message: "Ingredient has been updated!",
      result: result.dataValues,
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

    const result = await ingredients.findAll();

    res.status(200).json({
      ok: true,
      result,
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

    const ingredientId = req.params.ingredientId;

    const ingredientFound = await ingredients.findByPk(ingredientId);

    if (!ingredientFound) {
      const error = new Error("Ingredient was not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      ok: true,
      result: ingredientFound.dataValues,
    });
  } catch (error) {
    next(error);
  }
};
