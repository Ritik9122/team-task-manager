const express = require('express')
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.post('/', createTask)
router.get('/', getTasks)
router.get('/dashboard/stats', getDashboardStats)
router.get('/:id', getTaskById)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

module.exports = router
