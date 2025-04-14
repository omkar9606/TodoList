import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';

const TodoForm = () => {
  const { state } = useLocation();
  const todo = state?.todo || null;
  const [form, setForm] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
    category: todo?.category || 'Non-Urgent',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (todo) {
        await axios.put(`http://localhost:5000/api/todos/${todo._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/todos', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">{todo ? 'Edit Todo' : 'Create Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <Input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <Input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Urgent">Urgent</option>
            <option value="Non-Urgent">Non-Urgent</option>
          </select>
        </div>
        <Button type="submit">{todo ? 'Update' : 'Create'}</Button>
        <Button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="ml-2 bg-gray-600 hover:bg-gray-700"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default TodoForm;