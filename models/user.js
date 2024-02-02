const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String},
    photoDeProfil: { type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
});

// Hashage du mot de passe avant de sauvegarder dans la base de données
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password') || user.isNew) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    }
    
    next();
});

// Comparaison du mot de passe avec celui stocké dans la base de données
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
