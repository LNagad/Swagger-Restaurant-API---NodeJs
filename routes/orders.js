const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const { isAuth, isWaiter } = require("../middleware/is-auth");
const { notEmptyFields } = require("../helpers/routesValidationFields");

const ordersController = require("../controllers/ordersController");

router.get("/orders", isAuth, isWaiter, ordersController.getAll);

router.get("/orders/:dishId", isAuth, isWaiter, ordersController.getById);

router.post(
  "/orders",
  isAuth,
  isWaiter,
  notEmptyFields([{ name: "tableId", label: "tableId", min: 1 }]),
  [
    body("dishes")
      .isArray()
      .withMessage("Dishes must be an array")
      .isLength({ min: 1 })
      .withMessage("Dishes array must contain at least one element")
      .custom((dishes) => {
        const invalidIds = dishes.filter((id) => !Number.isInteger(id));
        if (invalidIds.length) {
          throw new Error(`Invalid dish IDs: ${invalidIds.join(",")}`);
        }
        return true;
      }),
  ],
  ordersController.create
);

router.put(
  "/orders/:dishId",
  isAuth,
  isWaiter,
  [
    body("dishes")
      .isArray()
      .withMessage("dishes must be an array")
      .isLength({ min: 1 })
      .withMessage("Dishes array must contain at least one element")
      .custom((dishes) => {
        const invalidIds = dishes.filter((id) => !Number.isInteger(id));
        if (invalidIds.length) {
          throw new Error(`Invalid dish IDs: ${invalidIds.join(",")}`);
        }
        return true;
      }),
  ],
  ordersController.update
);

router.delete("/orders/:dishId", isAuth, isWaiter, ordersController.delete);

module.exports = router;
