const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { isAuth, isAdmin } = require("../middleware/is-auth");
const dishesController = require("../controllers/dishesController");
const { notEmptyFields } = require("../helpers/routesValidationFields");

const ingredientsValidation = () => {
  return body("ingredients")
    // .isArray()
    // .withMessage("ingredients must be an array")
    .isLength({ min: 1 })
    .withMessage("ingredients array must contain at least one element")
    // .custom((dishes) => {
    //   const invalidIds = dishes.filter((id) => !Number.isInteger(id));
    //   if (invalidIds.length) {
    //     throw new Error(`Invalid ingredients IDs: ${invalidIds.join(",")}`);
    //   }
    //   return true;
    // });
};

router.get("/dishes", isAuth, dishesController.getAll);
router.get("/dishes/:dishId", isAuth, dishesController.getById);

//! DELETE THIS IMPLEMENTATION
router.post(
  "/dishes/try",
 dishesController.tryFile
);

router.post(
  "/dishes",
  isAuth,
  isAdmin,
  notEmptyFields([
    { name: "name", label: "Name" },
    { name: "price", label: "Price", min: 1 },
    { name: "servings", label: "Number of servings", min: 1 },
    { name: "category", label: "Category" },
  ]),
  ingredientsValidation(),
  dishesController.create
);

router.put(
  "/dishes/:dishId",
  isAuth,
  isAdmin,
  notEmptyFields([
    { name: "name", label: "Name" },
    { name: "price", label: "Price", min: 3 },
    { name: "servings", label: "Number of servings", min: 1 },
    { name: "category", label: "Category" },
    { name: "dishImg", label: "Dish Img" },
  ]),
  ingredientsValidation(),
  dishesController.update
);

router.patch(
  "/dishes/:dishId/partial",
  isAuth,
  isAdmin,
  dishesController.partialUpdate
);

module.exports = router;
