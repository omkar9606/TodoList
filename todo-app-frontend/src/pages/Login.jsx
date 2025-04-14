import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          placeholder="Email or Username"
        />
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <Button type="submit">Login</Button>
      </form>
      <p className="mt-4">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;