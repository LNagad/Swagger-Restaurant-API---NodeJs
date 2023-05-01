const tables = require("../models/table");
const orders = require("../models/order");
const { validationResult } = require("express-validator");
const TABLE_STATUS = require("../enums/tableStatus");
const ORDER_STATUS = require("../enums/orderStatus");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { capacity, description } = req.body;

    const result = await tables.create({
      capacity,
      description,
      status: TABLE_STATUS.DISPONIBLE,
    });

    res.status(201).json({
      ok: true,
      message: "Table has been added successfully!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { capacity, description } = req.body;

    const tableId = req.params.tableId;

    const tableFound = await tables.findByPk(tableId);

    if (!tableFound) {
      const error = new Error("Table was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    tableFound.capacity = capacity;
    tableFound.description = description;

    const result = await tableFound.save();

    res.status(200).json({
      ok: true,
      message: "Table has been updated!",
      result: result.dataValues,
    });
  } catch (error) {
    next(error);
  }
};

exports.partialUpdate = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { capacity, description } = req.body;

    const tableId = req.params.tableId;

    const tableFound = await tables.findByPk(tableId);

    if (!tableFound) {
      const error = new Error("Table was not found.");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }

    tableFound.capacity = capacity || tableFound.capacity;
    tableFound.description = description || tableFound.description;

    const result = await tableFound.save();

    res.status(200).json({
      ok: true,
      message: "Table has been updated!",
      result: result.dataValues,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const result = await tables.findAll();

    res.status(200).json({
      ok: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const tableId = req.params.tableId;

    const tableFound = await tables.findByPk(tableId);

    if (!tableFound) {
      const error = new Error("Table was not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      ok: true,
      result: tableFound.dataValues,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTableOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const tableId = req.params.tableId;

    const tableFound = await tables.findByPk(tableId);

    if (!tableFound) {
      const error = new Error("Table was not found.");
      error.statusCode = 404;
      throw error;
    }

    const tableOrders = await orders.findAll({
      where: { tableId: tableId, status: ORDER_STATUS.EN_PROCESO },
      raw: true,
    });

    if (!tableOrders || tableOrders.length < 1) {
      const error = new Error("No orders has been placed for this table.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      ok: true,
      result: tableOrders,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validations failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const tableId = req.params.tableId;
    const status = req.body.status;

    const tableFound = await tables.findByPk(tableId);

    if (!tableFound) {
      const error = new Error("Table was not found.");
      error.statusCode = 404;
      throw error;
    }

    const tableStatus = Object.values(TABLE_STATUS).includes(status)
      ? status
      : false;

    if (!tableStatus) {
      const error = new Error("Status was not found.");
      error.statusCode = 404;
      throw error;
    }

    tableFound.status = tableStatus;
    await tableFound.save();

    res.status(200).json({
      ok: true,
      result: tableFound.dataValues,
    });
  } catch (error) {
    next(error);
  }
};
