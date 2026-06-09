const Restaurant = require("../models/Restaurant");

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

exports.getRestaurants = async (filters) => {
  const { category, search } = filters;
  const query = {};

  if (category && category.toLowerCase() !== "all") {
    query.category = category.toLowerCase();
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { cuisine: { $regex: search, $options: "i" } },
    ];
  }

  return Restaurant.find(query);
};

exports.getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    throw createError(404, "Restaurant not found");
  }
  return restaurant;
};
