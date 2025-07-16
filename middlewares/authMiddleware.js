const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @function checkJWT
 * @description
 * Middleware pour vérifier la validité d’un token JWT envoyé par le client dans les headers.
 * Si le token est valide :
 * - Décode les informations utilisateur et les attache à req.user.
 * - Génère automatiquement un nouveau token valable 24h et le renvoie dans le header `Authorization`.
 * 
 * Si le token est absent ou invalide, renvoie une erreur 401.
 * 
 * @async
 * @param {import('express').Request} req - Objet requête Express (token attendu dans req.headers['authorization'] ou 'x-access-token').
 * @param {import('express').Response} res - Objet réponse Express (renvoie le nouveau token dans le header 'Authorization').
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware suivant.
 * 
 * @returns {Promise<void>} 
 * - Passe au middleware suivant si le token est valide.
 * - Sinon, code 401 avec message « token_required » ou « token_not_valid ».
 */
exports.checkJWT = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    return res.status(401).json({error: 'token_required'});
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
    return res.status(401).json({error: 'token_not_valid'});
  }
};
