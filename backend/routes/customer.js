const express = require('express');
const {
  getAll,
  create,
  getById,
  update,
  remove,
  addLog,
  deleteLog,
  addProject,
  deleteProject
} = require('../controllers/customerController');

const router = express.Router();

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/:id/logs', addLog);
router.delete('/:id/logs/:logId', deleteLog);
router.post('/:id/projects', addProject);
router.delete('/:id/projects/:projectId', deleteProject);


module.exports = router;
