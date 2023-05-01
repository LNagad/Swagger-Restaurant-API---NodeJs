const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { isAuth, isAdmin } = require("../middleware/is-auth");

const dishesController = require("../controllers/dishesController");

// Función que genera la validación de los campos
const validateFields = (fields) => {
  return fields.map((field) =>
    body(field.name)
      .trim()
      .notEmpty()
      .withMessage(`${field.label} field is required`)
      .isLength({ min: field.min || 5 })
      .withMessage(`${field.label} field must be at least 5 characters long`)
  );
};

const ingredientsValidation = (isEdit) => {
  return body("ingredients")
    .exists()
    .withMessage("Ingredients is required")
    .isObject()
    .withMessage("Ingredients must be an object")
    .custom((value) => {
      if (!value.new || value.new.length < 1) {
        throw new Error(
          "Invalid ingredients property, needs to send new ingredients list"
        );
      }
      if (isEdit) {
        if (
          !value.old ||
          value.old.length < 1 ||
          !value.new ||
          value.new.length < 1
        ) {
          throw new Error(
            "Invalid ingredients property, needs to send old ingredients list"
          );
        }
      }
      return true;
    });
};

router.get("/dishes", isAuth, isAdmin, dishesController.getAll);

router.get("/dishes/:dishId", isAuth, isAdmin, dishesController.getById);

router.post(
  "/dishes",
  isAuth,
  isAdmin,
  validateFields([
    { name: "name", label: "Name" },
    { name: "price", label: "Price", min: 3 },
    { name: "servings", label: "Number of servings", min: 1 },
    { name: "category", label: "Category" },
  ]),
  ingredientsValidation(false),
  dishesController.create
);

router.put(
  "/dishes/:dishId",
  isAuth,
  isAdmin,
  validateFields([
    { name: "name", label: "Name" },
    { name: "price", label: "Price", min: 3 },
    { name: "servings", label: "Number of servings", min: 1 },
    { name: "category", label: "Category" },
  ]),
  ingredientsValidation(true),
  dishesController.update
);
router.patch(
  "/dishes/:dishId/partial",
  isAuth,
  isAdmin,
  dishesController.partialUpdate
);

module.exports = router;
