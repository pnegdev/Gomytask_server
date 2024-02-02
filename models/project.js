const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    creationDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['A faire', 'En cours', 'Terminé'], default: 'A faire' },
    priority: { type: String, enum: ['Faible', 'Moyenne', 'Haute'], default: 'Faible' },
    tasks: [
        {
            type: String,
            enum: [
                'Cahier des charges',
                'Nom de domaine',
                'Hébergement',
                'Arborescence du site',
                'Maquette UI',
                'Back-end',
                'Front-end',
                'Test',
                'Mise en ligne',
                'Optimisation SEO'
            ],
        },
    ],
    tasksValidation: { type: Map, of: Boolean, default: {} },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;