import React from 'react';
import Button from './Button';

const TodoCard = ({ todo, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <h3 className="text-lg font-bold">{todo.title}</h3>
      <p>{todo.description}</p>
      <p>Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'N/A'}</p>
      <p>Category: {todo.category}</p>
      <div className="mt-2">
        <Button onClick={() => onEdit(todo)} className="mr-2">Edit</Button>
        <Button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this todo?')) {
              onDelete(todo._id);
            }
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TodoCard;