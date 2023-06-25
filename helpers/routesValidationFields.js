const { body } = require("express-validator");

exports.notEmptyFields = (fields) => {
  return fields.map((field) => {
    const fieldMin = field.min || 5;
    return body(field.name)
      .trim()
      .notEmpty()
      .withMessage(`${field.label} field is required`)
      .isLength({ min: fieldMin })
      .withMessage(`${field.label} field must be at least ${fieldMin} characters long`);
  });
};
