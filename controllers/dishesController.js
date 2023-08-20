const cloudinary = require('cloudinary')
const { validationResult } = require("express-validator");
const dishes = require("../models/dish");
const Ingredients = require("../models/ingredient");

require('dotenv').config()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const options = {
      upload_preset: 'restaurantAPI',
      file: { buffer },
    };

    cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    }).end(buffer);
  });
};

exports.tryFile = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    if (!req.file) {
      const error = new Error("No Image picked");
      error.statusCode = 400;
      throw error;
    }

    const { name, price, servings, ingredients, category, dishImg } = req.body;
    console.log({ name, price, servings, ingredients, category, dishImg })
    

  const cloudResp = await uploadBufferToCloudinary(req.file.buffer)
    console.log(cloudResp)
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { file} = req;

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }
    
    if (!file) {
      const error = new Error("No Image picked");
      error.statusCode = 400;
      throw error;
    }

    const { name, price, servings, ingredients, category } = req.body;
   
    const formattedIngredients = ingredients.replace(/[\[\]]/g, ''); // Eliminar corchetes '[' y ']' de la cadena
    const ingredientsArray = formattedIngredients.split(',').map((ingredient) => parseInt(ingredient));
    
    const result = await dishes.create({
      name,
      price,
      number_of_servings: servings,
      category,
    });

    const foundIngredients = await Ingredients.findAll({
      where: { id: ingredientsArray },
    });

    await result.addIngredients(foundIngredients);
    result.img =  await uploadBufferToCloudinary(file.buffer)
    await result.save()

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
    const { name, price, servings, ingredients, category, dishImg } = req.body;

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
    dishFound.img = dishImg;
    

    const result = await dishFound.save();

    const newIngredients = await Ingredients.findAll({
      where: { id: ingredients },
    });

    await result.removeIngredients();
    await result.setIngredients(newIngredients);

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
    const { name, price, servings, ingredients, category, dishImg } = req.body;

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
    dishFound.img = dishImg || dishFound.img;

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



exports.delete = async (req, res, next) => {
  try {

    const dishId = req.params.dishId;

    if (!dishId) {
      const error = new Error("Invalid dish id.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

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