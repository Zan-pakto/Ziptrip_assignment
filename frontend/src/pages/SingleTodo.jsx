import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

export default function SingleTodo() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTodo();
    } else {
      setError('No Task ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchTodo = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setTodo(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch task details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      setTodo({ ...todo, completed: !todo.completed });
      await axios.put(`${API_URL}/${todo._id}`, { completed: !todo.completed });
    } catch (err) {
      console.error(err);
      setTodo({ ...todo, completed: !todo.completed }); // revert on error
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        navigate('/todos');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{error || 'Task not found'}</h3>
        <Link to="/todos" className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <Link 
        to="/todos" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className={`h-3 w-full transition-colors ${todo.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}></div>
        
        <div className="p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {todo.title}
            </h1>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                todo.completed 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${todo.completed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                {todo.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Description Block */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
              {todo.description ? (
                <div className="prose prose-slate max-w-none text-slate-700 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="whitespace-pre-wrap leading-relaxed">{todo.description}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic bg-slate-50 rounded-2xl p-6 border border-slate-100 border-dashed">
                  No description provided for this task.
                </p>
              )}
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</p>
                  <p className="text-sm font-medium">{new Date(todo.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last Updated</p>
                  <p className="text-sm font-medium">{new Date(todo.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <button
                onClick={handleToggleComplete}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all active:scale-95 border ${
                  todo.completed 
                    ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-sm'
                    : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20'
                }`}
              >
                {todo.completed ? (
                  <>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Mark as Pending
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Mark as Completed
                  </>
                )}
              </button>
              
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all active:scale-95 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
