const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware pour vérifier le token JWT et rafraîchir automatiquement le token.
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 */
exports.checkJWT = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7); // Retire le préfixe "Bearer "
  }

  if (!token) {
    return res.status(401).json('token_required');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    // Rafraîchit le token (nouveau token valide 24h)
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, username: decoded.username },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Renvoie le nouveau token dans le header
    res.header('Authorization', 'Bearer ' + newToken);

    next();
  } catch (error) {
    return res.status(401).json('token_not_valid');
  }
};
