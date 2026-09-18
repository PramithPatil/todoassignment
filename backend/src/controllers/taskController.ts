import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Task from '../models/Task';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, sort } = req.query;
    // All task queries are scoped to the authenticated user
    const query: any = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    let sortObj: any = { createdAt: -1 };
    if (sort === 'dueDateTime') sortObj = { dueDateTime: 1 };
    else if (sort === 'priority') sortObj = { priority: -1 };
    else if (sort === 'createdAt') sortObj = { createdAt: -1 };

    const tasks = await Task.find(query).sort(sortObj);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, description, dueDateTime, priority } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDateTime,
      priority,
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure task belongs to the authenticated user
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const { title, description, dueDateTime, priority, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDateTime !== undefined) task.dueDateTime = dueDateTime;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    const updatedTask = await task.save();

    res.json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};
