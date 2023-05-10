const jwt = require("jsonwebtoken");

const ROLES = require("../enums/roles");

const UserModel = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  try {
    if (!authHeader) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    let decodedToken;

    const token = authHeader.split(" ")[1];

    decodedToken = await jwt.verify(token, "secret");

    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 403;
      throw error;
    }

    const userExist = await UserModel.findOne({
      where: { email: decodedToken.email },
    });

    if (!userExist) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

exports.isAdmin = (req, res, next) => {
  const user = req.user;

  try {
    if (user.role !== ROLES.ADMIN_ROLE) {
      const error = new Error("You are not allowed to access this section.");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    error.statusCode || 401;
    next(error);
  }
};

exports.isWaiter = (req, res, next) => {
  const user = req.user;

  try {
    if (user.role !== ROLES.WAITER_ROLE) {
      const error = new Error("You are not allowed to access this section.");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    error.statusCode || 401;
    next(error);
  }
};
