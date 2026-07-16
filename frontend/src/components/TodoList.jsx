import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos, onToggleComplete, onEdit, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos found. Add one above!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
