const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true }, // Starters, Main Course, Desserts, Beverages
  isVeg: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  calories: { type: Number, default: 250 },
  spicyLevel: { type: Number, default: 0 }, // 0: Mild, 1: Medium, 2: Spicy, 3: Extra Hot
  tag: { type: String, default: "" }, // Chef's Special, Trending, New, etc.
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  reviewsCount: { type: Number, default: 100 },
  deliveryTime: { type: Number, default: 30 }, // in minutes
  deliveryFee: { type: Number, default: 0 },

  cuisine: { type: String, required: true }, // e.g. "Italian, Pizza"
  category: { type: String, required: true }, // pizza, burgers, sushi, desserts, asian
  isFeatured: { type: Boolean, default: false },
  menu: [MenuItemSchema],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
