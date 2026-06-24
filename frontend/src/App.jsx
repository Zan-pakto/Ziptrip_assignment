import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoList';
import SingleTodo from './pages/SingleTodo';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Todo App</h1>
        </div>
      </nav>
      <main className="container mx-auto p-4 mt-8">
        <Routes>
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/todo" element={<SingleTodo />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
