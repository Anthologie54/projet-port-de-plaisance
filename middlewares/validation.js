/**
 * Middleware pour valider le format de l'email.
 */
exports.validateEmail = (req, res, next) => {
  const email = req.body.email;
  const emailRegex = /.+\@.+\..+/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'invalid_email_format' });
  }
  next();
};

/**
 * Middleware pour valider la longueur minimale du mot de passe.
 */
exports.validatePassword = (req, res, next) => {
  const password = req.body.password;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'password_too_short' });
  }
  next();
};

/**
 * Middleware pour valider le type de catway (doit être "long" ou "short").
 */
exports.validateCatwayType = (req, res, next) => {
  const type = req.body.catwayType;

  if (!type || !['long', 'short'].includes(type)) {
    return res.status(400).json({ error: 'invalid_catway_type' });
  }
  next();
};

/**
 * Middleware pour valider que la date de début précède la date de fin.
 */
exports.validateReservationDates = (req, res, next) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ error: 'invalid_reservation_dates' });
  }
  next();
};