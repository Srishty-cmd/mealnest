const Restaurant = require("../models/Restaurant");

exports.getRestaurants = async (req, res, next) => {
  try {
    const { category, search } = req.query;
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

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    console.error("Fetch restaurants error:", error);
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Fetch restaurant by ID error:", error);
    next(error);
  }
};
