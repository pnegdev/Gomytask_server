const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Vérifier si l'utilisateur est authentifié
const authenticateUser = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès non autorisé' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        req.userId = decodedToken.userId;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        res.status(401).json({ message: 'Accès non autorisé' });
    }
};

// Vérifier si l'utilisateur a les autorisations nécessaires
const authorizeUser = (roles) => {
    return (req, res, next) => {

    };
};

module.exports = { authenticateUser, authorizeUser };