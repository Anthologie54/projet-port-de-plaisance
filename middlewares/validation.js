/**
 * @function validateEmail
 * @description
 * Middleware pour vérifier que le champ email du corps de la requête est présent et a un format valide.
 * Si le format est incorrect ou manquant, renvoie une erreur 400.
 * 
 * @param {import('express').Request} req - Objet requête Express (req.body.email).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {void} Passe au middleware suivant ou renvoie code 400 avec message « invalid_email_format ».
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
 * @function validatePassword
 * @description
 * Middleware pour vérifier que le champ password du corps de la requête est présent
 * et contient au moins 8 caractères.
 * Si manquant ou trop court, renvoie une erreur 400.
 * 
 * @param {import('express').Request} req - Objet requête Express (req.body.password).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {void} Passe au middleware suivant ou renvoie code 400 avec message « password_too_short ».
 */

exports.validatePassword = (req, res, next) => {
  const password = req.body.password;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'password_too_short' });
  }
  next();
};


/**
 * @function validateCatwayType
 * @description
 * Middleware pour vérifier que le champ catwayType du corps de la requête est présent
 * et vaut « long » ou « short ».
 * Si manquant ou invalide, renvoie une erreur 400.
 * 
 * @param {import('express').Request} req - Objet requête Express (req.body.catwayType).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {void} Passe au middleware suivant ou renvoie code 400 avec message « invalid_catway_type ».
 */

exports.validateCatwayType = (req, res, next) => {
  const type = req.body.catwayType;

  if (!type || !['long', 'short'].includes(type)) {
    return res.status(400).json({ error: 'invalid_catway_type' });
  }
  next();
};

/**
 * @function validateReservationDates
 * @description
 * Middleware pour vérifier que les dates de début et de fin d’une réservation sont présentes
 * et que startDate précède strictement endDate.
 * Si invalide ou manquant, renvoie une erreur 400.
 * 
 * @param {import('express').Request} req - Objet requête Express (req.body.startDate et req.body.endDate).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {void} Passe au middleware suivant ou renvoie code 400 avec message « invalid_reservation_dates ».
 */
exports.validateReservationDates = (req, res, next) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate)) || new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ error: 'invalid_reservation_dates' });
  }
  next();
};