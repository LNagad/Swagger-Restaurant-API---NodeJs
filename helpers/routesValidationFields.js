const { body } = require("express-validator");

exports.notEmptyFields = (fields) => {
  return fields.map((field) =>
    body(field.name)
      .trim()
      .notEmpty()
      .withMessage(`${field.label} field is required`)
      .isLength({ min: field.min || 5 })
      .withMessage(`${field.label} field must be at least 5 characters long`)
  );
};
