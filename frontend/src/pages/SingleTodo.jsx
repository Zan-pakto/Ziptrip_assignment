import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

export default function SingleTodo() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTodo();
    } else {
      setError('No Todo ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchTodo = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setTodo(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch todo details');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!todo) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/todos" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Todos</Link>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{todo.title}</h2>
        <div className="mb-4">
          <span className="font-semibold">Status: </span>
          <span className={`px-2 py-1 rounded text-sm ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {todo.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        {todo.description && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Description:</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{todo.description}</p>
          </div>
        )}
        <div className="text-sm text-gray-500 mt-6">
          <p>Created: {new Date(todo.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date(todo.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
