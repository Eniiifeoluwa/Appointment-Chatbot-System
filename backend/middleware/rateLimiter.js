const rateLimit = require('express-rate-limit')
module.exports = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false
})
