const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    // If token is invalid, we still proceed but without req.user
    // This allows public access even if a stale token is present
    next();
  }
};
