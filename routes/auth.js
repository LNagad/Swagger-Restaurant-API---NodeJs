const express = require("express");
const { body, query } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");
const { isAuth } = require("../middleware/is-auth");


// Endpoint para verificar tokens
router.post('/verify-token', isAuth, (req, res) => {
  res.status(200).json({ok: true})
})

router.post(
  "/signup",
  [
    // query("isAdmin").exists().withMessage("The user role needs to be sent"),

    body("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter your display name")
    .isLength({ min: 7 })
    .withMessage("Name must contain minimun 7 digits"),

    body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Please enter a phone number")
    .isLength({ min: 10 })
    .withMessage("Phone must contain minimun 7 digits"),

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
