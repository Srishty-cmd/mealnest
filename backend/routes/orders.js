const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.post("/", authenticate, orderController.createOrder);
router.get("/", authenticate, orderController.getUserOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  orderController.updateOrderStatus,
);

module.exports = router;
