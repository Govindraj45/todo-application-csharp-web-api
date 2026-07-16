import { useCallback, useEffect, useState } from "react";
import { todoApi } from "./api/todoApi.js";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await todoApi.getAll({ search, category });
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  // Debounce search so we don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(fetchTodos, 300);
    return () => clearTimeout(timer);
  }, [fetchTodos]);

  async function handleCreateOrUpdate(form) {
    setError("");
    try {
      if (editingTodo) {
        await todoApi.update(editingTodo.id, {
          title: form.title,
          description: form.description,
          priority: form.priority,
          category: form.category,
          isCompleted: form.isCompleted ?? false
        });
        setEditingTodo(null);
      } else {
        await todoApi.create({
          title: form.title,
          description: form.description,
          priority: form.priority,
          category: form.category
        });
      }
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleComplete(todo) {
    setError("");
    try {
      await todoApi.update(todo.id, { ...todo, isCompleted: !todo.isCompleted });
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this todo?")) return;
    setError("");
    try {
      await todoApi.remove(id);
      if (editingTodo?.id === id) {
        setEditingTodo(null);
      }
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  const padCount = String(todos.length).padStart(3, "0");

  return (
    <div className="app">
      {/* ── Dark Header ── */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="header-logo-icon">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div>
            <h1 className="header-title">TODO LOG</h1>
            <p className="header-subtitle">C# .NET Core &bull; React &bull; PostgreSQL</p>
          </div>
        </div>
        <div className="entry-count-badge" aria-live="polite">
          <span className="live-indicator"></span>
          <span className="count-value">{padCount}</span>
          <span className="count-label">ENTRIES</span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="app-main">
        {/* Error with retry */}
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button className="btn-retry" onClick={fetchTodos}>Retry</button>
          </div>
        )}

        {/* Inline Form */}
        <section className="form-card" aria-label="Add or edit a task">
          <TodoForm
            editingTodo={editingTodo}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => setEditingTodo(null)}
          />
        </section>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Category Tabs */}
        <CategoryFilter activeCategory={category} onChange={setCategory} />

        {/* Task List Area — reserves height to prevent layout shift */}
        <section className="task-list-area" aria-label="Task list">
          {loading ? (
            <div className="loading-skeleton" aria-label="Loading tasks">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onEdit={(todo) => setEditingTodo(todo)}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
