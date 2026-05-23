export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `${field} is already registered` });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) => error.message).join(", ");
    return res.status(400).json({ message });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Server error"
  });
}
