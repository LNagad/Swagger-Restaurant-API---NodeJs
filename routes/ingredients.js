const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();

const { isAuth, isAdmin } = require("../middleware/is-auth");

const ingredientsController = require("../controllers/ingredientsController");

router.get("/ingredients", isAuth, isAdmin, ingredientsController.getAll);

router.get(
  "/ingredients/:ingredientId",
  isAuth,
  isAdmin,
  ingredientsController.getById
);

router.post(
  "/ingredients",
  isAuth,
  isAdmin,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("The name field is required")
      .isLength({ min: 5 })
      .withMessage("The name field must be at least 5 characters long"),
  ],
  ingredientsController.create
);

router.put(
  "/ingredients/:ingredientId",
  isAuth,
  isAdmin,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("The name field is required")
      .isLength({ min: 5 })
      .withMessage("The name field must be at least 5 characters long"),
  ],
  ingredientsController.update
);

module.exports = router;
