const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { createProject, getProjects, updateProject, deleteProject, validateTask, getAllTasks } = require('../controllers/projectController');

router.post('/', authenticateUser, createProject);
router.get('/', authenticateUser, getProjects);
router.put('/:projectId', authenticateUser, updateProject);
router.delete('/:projectId', authenticateUser, deleteProject);
router.post('/validateTask/:projectId', authenticateUser, validateTask);
router.get('/tasks', authenticateUser, getAllTasks);

module.exports = router;