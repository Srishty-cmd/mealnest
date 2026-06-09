const Order = require("../models/Order");

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

exports.createOrder = async (userId, orderData) => {
  const {
    restaurantId,
    items,
    subtotal,
    deliveryFee,
    tax,
    total,
    address,
    paymentMethod,
  } = orderData;

  if (!restaurantId || !items || !items.length || !address || !total) {
    throw createError(400, "Missing required order details");
  }

  return Order.create({
    user: userId,
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
};

exports.getUserOrders = async (userId) => {
  return Order.find({ user: userId })
    .populate("restaurant", "name image")
    .sort({ createdAt: -1 });
};

exports.getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId).populate(
    "restaurant",
    "name image cuisine rating deliveryTime",
  );

  if (!order) {
    throw createError(404, "Order not found");
  }

  if (order.user.toString() !== userId) {
    throw createError(403, "Unauthorized to view this order");
  }

  return order;
};

exports.updateOrderStatus = async (orderId, status) => {
  const validStatuses = [
    "Ordered",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  if (!validStatuses.includes(status)) {
    throw createError(400, "Invalid order status value");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );

  if (!order) {
    throw createError(404, "Order not found");
  }

  return order;
};
