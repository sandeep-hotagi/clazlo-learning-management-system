// server/middleware/roleCheck.js
// Simple role‑check helper used by route definitions.
// Usage: const roleCheck = require('../middleware/roleCheck');
// roleCheck(allowedRolesArray) returns an Express middleware that checks req.user.role.

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};
