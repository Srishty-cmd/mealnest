const router = require("express").Router();
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require("../validation/authValidation");

// Register Route with Validation Middleware
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  authController.register,
);

// Login Route with Validation Middleware
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  authController.login,
);

module.exports = router;
