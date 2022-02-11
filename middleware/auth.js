const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // vérifie si le token envoyé est valable et si l'user id correspond bien
  try {
    const token = req.headers.authorization.split(' ')[1]; // extrait le token du header authorization / split pour récupérer tout après l'espace dans le header
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // fonction verify pour décoder le token (si il n'est pas valide une erreur sera génégée)
    const userId = decodedToken.userId; // extrait de l'userID du token
    if (req.body.userId && req.body.userId !== userId) { // si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur ;
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};