const { body, validationResult } = require("express-validator");

// Validation for creating admin
const validateCreateAdmin = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),

  body("first_name").trim().isLength({ min: 1, max: 255 }).withMessage("First name is required and must be less than 255 characters"),

  body("last_name").trim().isLength({ min: 1, max: 255 }).withMessage("Last name is required and must be less than 255 characters"),

  body("role").optional().isIn(["default", "admin"]).withMessage("Role must be either 'default' or 'admin'"),
];

// Validation for editing user
const validateEditUser = [
  body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),

  body("first_name").optional().trim().isLength({ min: 1, max: 255 }).withMessage("First name must be less than 255 characters"),

  body("last_name").optional().trim().isLength({ min: 1, max: 255 }).withMessage("Last name must be less than 255 characters"),

  body("role").optional().isIn(["default", "admin"]).withMessage("Role must be either 'default' or 'admin'"),

  body("is_active").optional().isBoolean().withMessage("is_active must be a boolean value"),

  body("status").optional().isIn(["active", "banned", "inactive"]).withMessage("Status must be one of: active, banned, inactive"),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateCreateAdmin,
  validateEditUser,
  handleValidationErrors,
};
