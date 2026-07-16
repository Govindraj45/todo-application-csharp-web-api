import PriorityBadge from "./PriorityBadge.jsx";

export default function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
  const borderClass =
    todo.priority === "High" ? "border-high" :
    todo.priority === "Medium" ? "border-medium" : "border-low";

  return (
    <li className={`todo-card ${borderClass} ${todo.isCompleted ? "completed" : ""}`}>
      <div className="card-left">
        <input
          className="todo-checkbox"
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggleComplete(todo)}
          aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? "incomplete" : "complete"}`}
        />
        <div className="card-text">
          <span className="card-title">{todo.title}</span>
          {todo.description && <p className="card-desc">{todo.description}</p>}
        </div>
      </div>
      <div className="card-right">
        <PriorityBadge priority={todo.priority} />
        <span className="category-pill">{todo.category}</span>
        <button
          className="btn-edit"
          onClick={() => onEdit(todo)}
          aria-label={`Edit "${todo.title}"`}
        >
          Edit
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
