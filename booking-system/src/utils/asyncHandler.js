// Wraps an async controller function so thrown errors are passed to
// Express's error-handling middleware instead of crashing the app.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
