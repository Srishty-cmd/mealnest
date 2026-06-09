const restaurantService = require("../services/restaurantService");

exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurantService.getRestaurants(req.query);
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};
