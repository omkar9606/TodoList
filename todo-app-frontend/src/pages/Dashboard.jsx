import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodoCard from '../components/TodoCard';
import Button from '../components/Button';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/todos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchTodos();
  }, [navigate]);

  const handleEdit = (todo) => {
    navigate('/todo', { state: { todo } });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div>
          <Button onClick={() => navigate('/todo')} className="mr-2">
            Add Todo
          </Button>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
            Logout
          </Button>
        </div>
      </div>
      {todos.length === 0 ? (
        <p>No todos yet. Create one!</p>
      ) : (
        todos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} onEdit={handleEdit} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default Dashboard;