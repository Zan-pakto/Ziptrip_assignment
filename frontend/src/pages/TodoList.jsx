import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/todos';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { title, description });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title, description });
      }
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo._id}`, { completed: !todo.completed });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo._id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Todo' : 'Add Todo'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setDescription('');
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div key={todo._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="w-5 h-5 cursor-pointer"
              />
              <div className={todo.completed ? 'line-through text-gray-500' : ''}>
                <h3 className="font-bold text-lg">{todo.title}</h3>
                {todo.description && <p className="text-gray-600 text-sm mt-1">{todo.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/todo?id=${todo._id}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                View
              </Link>
              <button
                onClick={() => handleEdit(todo)}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
