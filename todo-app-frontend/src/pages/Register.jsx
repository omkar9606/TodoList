import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/input';
import Button from '../components/Button';

const Register = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!form.email || !form.username || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        setError('Registration failed. No token received.');
      }
    } catch (err) {
      // Improved error handling
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <Input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <Button type="submit">Register</Button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
