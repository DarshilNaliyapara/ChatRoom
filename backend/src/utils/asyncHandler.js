const asyncHandler = (fn) => {
  return (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      res.status(err.code).json({ success: false, message: err.message });
    }
  };
};
export { asyncHandler };
