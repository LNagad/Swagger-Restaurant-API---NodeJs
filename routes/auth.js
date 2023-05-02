const express = require("express");
const { body, query } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *     - auth
 *     summary: Create a new user account
 *     parameters:
 *       - in: query
 *         name: isAdmin
 *         required: true
 *         description: The user role needs to be sent
 *         schema:
 *           type: boolean
 *       - in: body
 *         name: User details
 *         required: true
 *         description: The user details needed to create a new account
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully created a new user account
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *     - auth
 *     summary: Log in to an existing user account
 *     parameters:
 *       - in: body
 *         name: User credentials
 *         required: true
 *         description: The user credentials needed to log in to an existing account
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully logged in to the user account
 *       400:
 *         description: Invalid input parameters
 *       401:
 *         description: Invalid user credentials
 *       500:
 *         description: Internal server error
 */
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
