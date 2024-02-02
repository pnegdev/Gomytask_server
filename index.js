const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectsRouter = require('./routes/projects');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.URI_MONGODB;

app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connexion à la base de données MongoDB établie avec succès');
});


app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/projects', projectsRouter);
app.use('/uploads', express.static('uploads'));

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});