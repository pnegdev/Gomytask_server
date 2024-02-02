const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Connexion
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_KEY);

            return res.status(200).json({ message: 'Connecté avec succès', user, token });
        } else {
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

// Création d'un nouvel utilisateur
const register = async (req, res) => {
    const { username, password, nom, prenom, email, photo } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        const newUser = new User({ username, password, nom, prenom, email, photo });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
    try {
        const { username, email, newPassword } = req.body;
        const user = await User.findOne({ username, email });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe :', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.' });
    }
};

// Déconnexion
const logout = async (req, res) => {
    res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = { login, register, resetPassword, logout };

// Connexion
// const login = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });

//         if (!user) {
//             return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
//         }

//         const isPasswordValid = await user.comparePassword(password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
//         }

//         // Génération du jeton JWT
//         const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });

//         res.status(200).json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la connexion' });
//     }
// };