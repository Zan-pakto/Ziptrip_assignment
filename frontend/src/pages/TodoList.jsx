import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/todos';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      // Optimistic UI update
      setTodos(todos.map(t => t._id === todo._id ? { ...t, completed: !t.completed } : t));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Tasks</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            {pendingCount} {pendingCount === 1 ? 'task' : 'tasks'} remaining
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 transition-all focus-within:shadow-md focus-within:border-indigo-300">
        <h3 className="text-sm font-semibold text-indigo-600 mb-4 uppercase tracking-wider">
          {editingId ? 'Edit Task' : 'Create New Task'}
        </h3>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Add details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-400 resize-none"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
              {editingId ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Update
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add Task
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDescription('');
                }}
                className="px-6 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100 mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700">No tasks yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Get started by creating a new task above.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo._id} 
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border transition-all duration-200 ${
                todo.completed 
                  ? 'border-slate-100 bg-slate-50/50' 
                  : 'border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => handleToggleComplete(todo)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300 hover:border-indigo-500 bg-white'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <Link to={`/todo?id=${todo._id}`} className="block group-hover:text-indigo-600 transition-colors">
                    <h3 className={`font-semibold text-[1.05rem] truncate transition-colors ${
                      todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}>
                      {todo.title}
                    </h3>
                  </Link>
                  {todo.description && (
                    <p className={`mt-1 text-sm line-clamp-2 ${
                      todo.completed ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 pl-10 sm:pl-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/todo?id=${todo._id}`}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  title="View Details"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </Link>
                <button
                  onClick={() => handleEdit(todo)}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
