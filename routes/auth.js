const express = require("express");
const { body, query } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");

router.post(
  "/signup",
  [
    query("isAdmin").exists().withMessage("The user role needs to be sent"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter a password")
      .isLength({ min: 7 })
      .withMessage("Password must contain minimun 7 digits")
      .matches(/^(?=.*[!@#$%^&*])/)
      .withMessage("Password must contain at least one special character"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),

    body("password").trim().notEmpty().withMessage("Please enter the password"),
  ],
  authController.login
);

module.exports = router;
