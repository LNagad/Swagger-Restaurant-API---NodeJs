const ROLES = require("../enums/roles");
const userModel = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { email, password, name, phoneNumber } = req.body;
  
  try {
    //Catch possibles errors from route validations using express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    //Catch the user role sent from the client: ADMIN || WAITER
    const isAdmin = req.query.isAdmin;
    console.log(isAdmin)
    const userExist = await userModel.findOne({ where: { email: email } });

    if (userExist) {
      const error = new Error("The user entered already exist");
      error.statusCode = 400;
      throw error;
    }

    const passwordHashed = await bcrypt.hashSync(password, 12);
    
    const userRole = isAdmin ? ROLES.ADMIN_ROLE : ROLES.WAITER_ROLE;

    const user = await userModel.create({
      email: email,
      password: passwordHashed,
      role: userRole,
      name: name,
      phoneNumber: phoneNumber
    });

    res.status(201).json({
      ok: true,
      message: "User has been created!",
      user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    //Catch possibles errors from route validations using express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { email, password } = req.body;

    const userExist = await userModel.findOne({ where: { email: email } });

    if (!userExist) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const passwordValid = await bcrypt.compareSync(
      password,
      userExist.password
    );

    if (!passwordValid) {
      const error = new Error("Invalid password.");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign(
      { email: userExist.email, userId: userExist.id, role: userExist.role },
      "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      ok: true,
      token,
      userId: userExist.id,
      email: userExist.email,
      name: userExist.name,
      role: userExist.role,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
