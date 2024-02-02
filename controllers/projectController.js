const Project = require('../models/project');

// Création d'un nouveau projet
const createProject = async (req, res) => {
    try {
        const { title, description, deadline, tasks, priority } = req.body;
        const userId = req.userId;

        const tasksValidation = {};
        tasks.forEach(task => {
            tasksValidation[task] = false;
        });

        const newProject = new Project({
            title,
            description,
            deadline,
            tasks,
            tasksValidation,
            user: userId,
            priority,
        });
    
        const savedProject = await newProject.save();
    
        res.status(201).json(savedProject);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du projet' });
    }
};

// Récupération de tous les projets
const getProjects = async (req, res) => {
    try {
        const userId = req.userId;
        const userProjects = await Project.find({ user: userId }).populate('user');

        res.json(userProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets de l\'utilisateur' });
    }
};

// Mise à jour d'un projet
const updateProject = async (req, res) => {
    const projectId = req.params.projectId;
    const updatedFields = req.body;

    try {
        // Le paramètre { new: true } renvoie le projet mis à jour plutôt que l'ancien
        const updatedProject = await Project.findByIdAndUpdate(projectId, updatedFields, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        res.json(updatedProject);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du projet', error: error.message });
    }
};


// Suppression d'un projet
const deleteProject = async (req, res) => {
    const projectId = req.params.projectId;

    try {
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        res.json({ message: 'Projet supprimé avec succès', deletedProject });
    } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du projet', error: error.message });
    }
};

// Validation des tâches
const validateTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { task } = req.body;

        const updatedProject = await Project.findOneAndUpdate(
            { _id: projectId, [`tasksValidation.${task}`]: { $ne: true } },
            { $set: { [`tasksValidation.${task}`]: true } },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Projet non trouvé ou tâche déjà validée' });
        }

        const isAllTasksValidated = [...updatedProject.tasksValidation.values()].every(Boolean);
        const status = isAllTasksValidated ? 'Terminé' : 'En cours';


        const projectWithStatus = await Project.findOneAndUpdate(
            { _id: projectId },
            { $set: { status } },
            { new: true }
        );

        if (!projectWithStatus) {
            return res.status(404).json({ message: 'Projet non trouvé lors de la mise à jour du statut' });
        }

        res.json(projectWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut du projet' });
    }
};

// Récupération de toutes les tâches
const getAllTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const projects = await Project.find({ user: userId });

        const tasksData = projects.reduce((acc, project) => {
            const tasks = project.tasks.filter(task => !project.tasksValidation.get(task));

            const projectTasksData = tasks.map(task => ({
                _id: task._id,
                taskName: task,
                projectName: project.title,
                projectPriority: project.priority,
                projectDeadline: project.deadline,
            }));

            return [...acc, ...projectTasksData];
        }, []);

        res.json(tasksData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches à faire' });
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject, validateTask, getAllTasks };
