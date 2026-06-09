const orderService = require("../services/orderService");

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
};
