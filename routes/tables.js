const express = require("express");
const router = express.Router();

const { isAuth, isAdmin, isWaiter } = require("../middleware/is-auth");
const { notEmptyFields } = require("../helpers/routesValidationFields");

const tablesController = require("../controllers/tablesController");

router.get("/tables", isAuth, tablesController.getAll);

router.get("/tables/:tableId", isAuth, tablesController.getById);

router.post(
  "/tables",
  isAuth,
  isAdmin,
  notEmptyFields([
    { name: "capacity", label: "Capacity", min: 1 },
    { name: "description", label: "Description" },
  ]),
  tablesController.create
);

router.put(
  "/tables/:tableId",
  isAuth,
  isAdmin,
  notEmptyFields([
    { name: "capacity", label: "Capacity", min: 1 },
    { name: "description", label: "Description" },
  ]),
  tablesController.update
);

//Weiter

router.get(
  "/tables/:tableId/orders",
  isAuth,
  isWaiter,
  tablesController.getTableOrder
);

router.patch(
  "/tables/:tableId/changeStatus",
  isAuth,
  isWaiter,
  tablesController.changeStatus
);

module.exports = router;
