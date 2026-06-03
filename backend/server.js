require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./seed/restaurantSeed");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn(
        "Warning: seeding database failed:",
        seedErr.message || seedErr,
      );
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.warn("Starting server without DB connection (degraded mode).");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB not connected)`);
    });
  });
