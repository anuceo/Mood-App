const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains. If any errors exist, returns 422
 * with a structured errors array. Otherwise passes to the next handler.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validate };
