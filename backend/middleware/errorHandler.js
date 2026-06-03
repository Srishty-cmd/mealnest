module.exports = (err, req, res, next) => {
  console.error(err.stack || err);

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages[0] || "Validation error" });
  }

  // Duplicate key error (e.g., unique email)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const prettyField = field === "email" ? "Email" : field;
    return res
      .status(400)
      .json({ error: `${prettyField} '${value}' is already registered` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid identifier provided" });
  }

  // Default
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
};
