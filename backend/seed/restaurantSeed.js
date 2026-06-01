const Restaurant = require("../models/Restaurant");

const mockRestaurants = [
  {
    name: "La Piazza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 320,
    deliveryTime: 25,
    deliveryFee: 40,
    cuisine: "Italian, Pizza, Pasta",
    category: "pizza",
    isFeatured: true,
    menu: [
      {
        name: "Margherita Basil Pizza",
        description:
          "Fresh mozzarella, vine-ripened tomatoes, sweet basil, and extra virgin olive oil.",
        price: 299,
        category: "Main Course",
        isVeg: true,
        isPopular: true,
        calories: 290,
        spicyLevel: 0,
        tag: "Best Seller",
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Truffle Mushroom Fettuccine",
        description:
          "Creamy cheese sauce, wild forest mushrooms, and white truffle oil drizzle.",
        price: 349,
        category: "Main Course",
        isVeg: true,
        isPopular: false,
        calories: 380,
        spicyLevel: 0,
        tag: "Chef's Special",
        image:
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Garlic Butter Breadsticks",
        description:
          "Golden oven-baked dough brushed with herb butter and served with marinara sauce.",
        price: 149,
        category: "Starters",
        isVeg: true,
        isPopular: true,
        calories: 210,
        spicyLevel: 0,
        tag: "Trending",
        image:
          "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Classic Espresso Tiramisu",
        description:
          "Rich espresso-soaked ladyfingers layered with sweet mascarpone cream and cocoa powder.",
        price: 249,
        category: "Desserts",
        isVeg: true,
        isPopular: true,
        calories: 310,
        spicyLevel: 0,
        tag: "Signature Delight",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    name: "Burger Craft",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    reviewsCount: 240,
    deliveryTime: 20,
    deliveryFee: 30,
    cuisine: "Burgers, American, Fast Food",
    category: "burgers",
    isFeatured: true,
    menu: [
      {
        name: "Smoky Bacon Cheddar Burger",
        description:
          "Flame-grilled prime patty, melted sharp cheddar, smoked wood smoke sauce, lettuce, and pickles.",
        price: 249,
        category: "Main Course",
        isVeg: false,
        isPopular: true,
        calories: 540,
        spicyLevel: 1,
        tag: "Best Seller",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Truffle Brioche Burger",
        description:
          "Butter-toasted soft brioche bun, Swiss Emmental cheese, caramelized onions, and garlic-truffle aioli.",
        price: 289,
        category: "Main Course",
        isVeg: false,
        isPopular: false,
        calories: 580,
        spicyLevel: 0,
        tag: "Gourmet Special",
        image:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Peri-Peri Loaded Cheese Fries",
        description:
          "Double-fried crispy thin potatoes dusted in peri-peri spices and layered in warm melted cheese.",
        price: 129,
        category: "Starters",
        isVeg: true,
        isPopular: true,
        calories: 390,
        spicyLevel: 2,
        tag: "Spicy 🔥",
        image:
          "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Vanilla Bean Whipped Milkshake",
        description:
          "Churned Madagascan vanilla ice cream blended with cold milk, topped with rich whipped cream.",
        price: 179,
        category: "Beverages",
        isVeg: true,
        isPopular: false,
        calories: 420,
        spicyLevel: 0,
        tag: "Refreshing Drink",
        image:
          "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    name: "Sakura Sushi & Ramen",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    reviewsCount: 185,
    deliveryTime: 35,
    deliveryFee: 50,
    cuisine: "Japanese, Sushi, Ramen",
    category: "sushi",
    isFeatured: false,
    menu: [
      {
        name: "Premium Salmon Avocado Roll",
        description:
          "Fresh sliced Atlantic salmon, creamy Hass avocado, rolled in seasoned sushi rice, topped with golden tobiko.",
        price: 499,
        category: "Main Course",
        isVeg: false,
        isPopular: true,
        calories: 320,
        spicyLevel: 0,
        tag: "Best Seller",
        image:
          "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Crispy Ebi Tempura Maki",
        description:
          "Flash-fried crispy jumbo shrimp tempura rolled in rice with spicy wasabi mayo and sweet unagi soy reduction.",
        price: 449,
        category: "Main Course",
        isVeg: false,
        isPopular: true,
        calories: 380,
        spicyLevel: 1,
        tag: "Highly Recommended",
        image:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Vegetarian Avocado Dragon Roll",
        description:
          "Cucumber, pickled carrot, pickled radish rolled and topped with paper-thin slices of ripe avocado.",
        price: 399,
        category: "Main Course",
        isVeg: true,
        isPopular: false,
        calories: 260,
        spicyLevel: 0,
        tag: "Healthy Choice",
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Matcha Mochi Trios",
        description:
          "Chewy sweet Japanese rice cakes filled with premium slow-churned green tea ice cream.",
        price: 199,
        category: "Desserts",
        isVeg: true,
        isPopular: false,
        calories: 180,
        spicyLevel: 0,
        tag: "New Sweet",
        image:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    name: "Sweet Alchemy",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 450,
    deliveryTime: 15,
    deliveryFee: 20,
    cuisine: "Waffles, Crepes, Cakes",
    category: "desserts",
    isFeatured: true,
    menu: [
      {
        name: "Death by Chocolate Waffle",
        description:
          "Fresh golden Belgian waffle, dark chocolate glaze, white chocolate drizzle, and organic cocoa nibs.",
        price: 199,
        category: "Desserts",
        isVeg: true,
        isPopular: true,
        calories: 480,
        spicyLevel: 0,
        tag: "Best Seller",
        image:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Warm Blueberry Molten Cake",
        description:
          "Soft white chocolate sponge cake with a warm flowing blueberry reduction center, baked to order.",
        price: 189,
        category: "Desserts",
        isVeg: true,
        isPopular: false,
        calories: 340,
        spicyLevel: 0,
        tag: "Chef's Special",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Red Velvet Cream Cupcake",
        description:
          "Fluffy scarlet vanilla sponge cake crowned with an elegant whipped sweet cream cheese icing peak.",
        price: 99,
        category: "Desserts",
        isVeg: true,
        isPopular: true,
        calories: 220,
        spicyLevel: 0,
        tag: "Popular Choice",
        image:
          "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=400",
      },
      {
        name: "Salted Caramel Macaron",
        description:
          "Delicate French almond shells sandwiched with a rich caramel ganache and fine sea salt flakes.",
        price: 79,
        category: "Desserts",
        isVeg: true,
        isPopular: false,
        calories: 95,
        spicyLevel: 0,
        tag: "Gourmet",
        image:
          "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await Restaurant.deleteMany({});
    console.log("Cleared existing restaurants for fresh seed...");
    await Restaurant.insertMany(mockRestaurants);
    console.log("Seeding complete! 4 restaurants with full menus populated.");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
};

module.exports = seedDatabase;
