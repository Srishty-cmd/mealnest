const router = require("express").Router();
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors,
} = require("../validation/authValidation");
const { authenticate, authorizeRoles } = require("../middleware/auth");

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

// Forgot Password Route
router.post(
  "/forgot-password",
  validateForgotPassword,
  handleValidationErrors,
  authController.forgotPassword,
);

// Reset Password Route
router.post(
  "/reset-password",
  validateResetPassword,
  handleValidationErrors,
  authController.resetPassword,
);

// Admin-only user management
router.get(
  "/admin/users",
  authenticate,
  authorizeRoles("admin"),
  authController.getAllUsers,
);

router.put(
  "/admin/user/:id/role",
  authenticate,
  authorizeRoles("admin"),
  authController.updateUserRole,
);

module.exports = router;
