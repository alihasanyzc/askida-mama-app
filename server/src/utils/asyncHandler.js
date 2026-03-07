/**
 * Async handler wrapper
 * try-catch yazmadan controller'larda async hataları yakalar
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
