import express from 'express';
import { body } from 'express-validator';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('dueDateTime').isISO8601().withMessage('Due date time must be a valid ISO 8601 date'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  ],
  createTask
);

router.put('/:id', updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);

export default router;
