require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./seed/restaurantSeed");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
