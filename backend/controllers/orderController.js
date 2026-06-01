const Order = require("../models/Order");

exports.createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      address,
      paymentMethod,
    } = req.body;

    if (!restaurantId || !items || !items.length || !address || !total) {
      return res.status(400).json({ error: "Missing required order details" });
    }

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      address,
      paymentMethod,
      status: "Ordered",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch user orders error:", error);
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "restaurant",
      "name image cuisine rating deliveryTime",
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Fetch order by ID error:", error);
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Ordered",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    next(error);
  }
};
