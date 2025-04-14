const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTodo = async (req, res) => {
  const { title, description, dueDate, category } = req.body;

  try {
    const newTodo = new Todo({
      title,
      description,
      dueDate,
      category,
      user: req.user
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    res.json(todo);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    res.json({ message: 'Todo deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
