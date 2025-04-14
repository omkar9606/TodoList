const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

const router = express.Router();

// Get all todos
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create todo
router.post(
  '/',
  [
    auth,
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('dueDate').optional().isISO8601().toDate(),
    body('category').isIn(['Urgent', 'Non-Urgent']).withMessage('Invalid category'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, category } = req.body;

    try {
      const todo = new Todo({
        title,
        description,
        dueDate,
        category,
        user: req.user.id,
      });

      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update todo
router.put(
  '/:id',
  [
    auth,
    body('title').optional().isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('dueDate').optional().isISO8601().toDate(),
    body('category').optional().isIn(['Urgent', 'Non-Urgent']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      Object.assign(todo, req.body);
      await todo.save();
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;