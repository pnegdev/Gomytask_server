const User = require('../models/user');
const Project = require('../models/project');
const fs = require('fs');
const path = require('path');

// Création d'un nouvel utilisateur
const createUser = async (req, res) => {
    try {
        const { username, password, nom, prenom, email, photoDeProfil } = req.body;

        const newUser = new User({
            username,
            password,
            nom,
            prenom,
            email,
            photoDeProfil,
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Récupération des informations d'un utilisateur
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        res.status(200).json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du profil de l\'utilisateur' });
    }
};

// Mise à jour d'un utilisateur
const updateUserProfile = async (req, res) => {
    const userId = req.userId;
    const { username, nom, prenom, email, photoDeProfil } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (username) user.username = username;
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;
        if (email) user.email = email;
        if (photoDeProfil) user.photoDeProfil = photoDeProfil;

        await user.save();

        res.status(200).json({ message: 'Profil mis à jour avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
};

// Changement du mot de passe
const changePassword = async (req, res) => {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe :', error);
        res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
    }
};

// Mise à jour de la photo de profil
const updateProfilePhoto = async (req, res) => {
    const userId = req.userId;
    const { username, nom, prenom, email } = req.body;
    const photoDeProfil = req.file ? req.file.filename : undefined;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const filePath = user.photoDeProfil ? path.join(__dirname, '../uploads', user.photoDeProfil) : undefined;

        if (username) user.username = username;
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;
        if (email) user.email = email;

        if (user.photoDeProfil && filePath) {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('Fichier supprimé avec succès :', filePath);
                } else {
                    console.log('Le fichier n\'existe pas :', filePath);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du fichier :', error);
            }
        }

        user.photoDeProfil = photoDeProfil;

        await user.save();

        res.status(200).json({ message: 'Photo de profil mise à jour avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la photo de profil :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil' });
    }
};

// Récupération des informations de tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        const usersWithProjects = await Promise.all(users.map(async (user) => {
            const projects = await Project.find({ user: user._id });
            return { ...user.toJSON(), projects };
        }));

        res.status(200).json(usersWithProjects);
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les utilisateurs :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de tous les utilisateurs' });
    }
};

module.exports = { createUser, getUserProfile, updateUserProfile, changePassword, updateProfilePhoto, getAllUsers };
