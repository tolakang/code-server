// Auth middleware placeholder
// Currently no-op since auth is disabled by default
// Enable by adding JWT validation logic when AUTH_TYPE=password

const authMiddleware = (req, res, next) => {
  // Pass through for now - auth is disabled
  // When enabled, verify JWT token from Authorization header
  next();
};

const requireAuth = (req, res, next) => {
  // Placeholder for auth check
  next();
};

const requireRole = (role) => (req, res, next) => {
  // Placeholder for role check
  next();
};

module.exports = { authMiddleware, requireAuth, requireRole };
