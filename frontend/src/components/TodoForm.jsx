// Import useEffect (runs side effects when data changes) and useState (manages component state) from React
import { useEffect, useState } from "react";

// Default empty form object — used to reset the form after submission or when cancelling an edit.
// We define it outside the component so it's not recreated on every render (performance optimization).
const EMPTY_FORM = {
  title: "",          // Empty string for the title input
  description: "",    // Empty string for the description input
  priority: "Medium", // Default priority is "Medium" — matches the backend enum PriorityLevel
  category: "Work"    // Default category is "Work" — matches the backend enum TodoCategory
};

// React functional component. It receives 3 props from App.jsx:
//   editingTodo — the todo object being edited (null if creating a new one)
//   onSubmit    — callback function to create or update the todo
//   onCancel    — callback function to exit edit mode
export default function TodoForm({ editingTodo, onSubmit, onCancel }) {

  // useState hook: 'form' holds the current values of all input fields.
  // setForm is the function to update it. Initial value is EMPTY_FORM.
  const [form, setForm] = useState(EMPTY_FORM);

  // useEffect hook: runs every time 'editingTodo' changes (specified in the dependency array [editingTodo]).
  // This is what makes the form switch between "Create" mode and "Edit" mode.
  useEffect(() => {
    if (editingTodo) {
      // EDIT MODE: User clicked "Edit" on a todo card in the list.
      // Pre-fill the form inputs with the existing todo's data.
      setForm({
        title: editingTodo.title,                   // Fill the title field
        description: editingTodo.description || "",  // Fill description (use "" if null to avoid uncontrolled input warning)
        priority: editingTodo.priority,              // Fill the priority dropdown
        category: editingTodo.category,              // Fill the category dropdown
        isCompleted: editingTodo.isCompleted          // Preserve the completion status (needed for the PUT request)
      });
    } else {
      // CREATE MODE: No todo is being edited — reset the form to blank defaults.
      setForm(EMPTY_FORM);
    }
  }, [editingTodo]); // Dependency array: this effect re-runs ONLY when editingTodo changes

  // Generic change handler for ALL input/select fields.
  // Works because each input has a 'name' attribute matching the key in our form state object.
  function handleChange(e) {
    // Destructure the 'name' and 'value' from the HTML element that fired the event.
    // e.g., for the title input: name="title", value="Buy groceries"
    const { name, value } = e.target;

    // Update state using the functional form of setForm.
    // Spread the previous state (...prev) and override only the changed field ([name]: value).
    // This is called a "computed property name" — [name] dynamically sets the key.
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Called when the user clicks the submit button (or presses Enter).
  function handleSubmit(e) {
    // Prevent the browser's default form submission behavior (which would reload the page).
    e.preventDefault();

    // Client-side validation: if the title is empty or only whitespace, don't submit.
    if (!form.title.trim()) return;

    // Call the parent's onSubmit callback (defined in App.jsx).
    // App.jsx will decide whether to call todoApi.create() or todoApi.update() based on editingTodo.
    onSubmit(form);

    // If we were creating (not editing), reset the form to blank so the user can add another task.
    // If editing, we don't reset because App.jsx will set editingTodo to null, triggering the useEffect above.
    if (!editingTodo) setForm(EMPTY_FORM);
  }

  // JSX: The rendered HTML form
  return (
    // The form element. onSubmit fires handleSubmit when the user clicks the button or presses Enter.
    <form className="todo-form" onSubmit={handleSubmit}>

      {/* Row container that holds all input fields side by side */}
      <div className="form-row">

        {/* ── Title Field ── */}
        <div className="form-field">
          {/* htmlFor links this label to the input with id="todo-title" (accessibility) */}
          <label htmlFor="todo-title">Title</label>
          <input
            id="todo-title"         // Unique ID for accessibility (matches htmlFor above)
            name="title"            // Must match the key in our form state object
            placeholder="Task title..."
            value={form.title}      // Controlled component: React state drives the input value
            onChange={handleChange}  // Calls handleChange on every keystroke
            required                // HTML5 validation: browser won't submit if empty
            maxLength={200}         // Matches backend DTO validation: [StringLength(200)]
          />
        </div>

        {/* ── Description Field ── */}
        <div className="form-field">
          <label htmlFor="todo-desc">Description</label>
          <input
            id="todo-desc"
            name="description"       // Matches form state key "description"
            placeholder="Description..."
            value={form.description} // Controlled component
            onChange={handleChange}
            maxLength={2000}         // Matches backend DTO validation: [StringLength(2000)]
          />
        </div>

        {/* ── Priority Dropdown ── */}
        <div className="form-field">
          <label htmlFor="todo-priority">Priority</label>
          {/* select element: value prop makes it a controlled component */}
          <select id="todo-priority" name="priority" value={form.priority} onChange={handleChange}>
            {/* These string values ("Low", "Medium", "High") match the C# PriorityLevel enum exactly */}
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* ── Category Dropdown ── */}
        <div className="form-field">
          <label htmlFor="todo-category">Category</label>
          <select id="todo-category" name="category" value={form.category} onChange={handleChange}>
            {/* These string values ("Work", "Personal", "Other") match the C# TodoCategory enum exactly */}
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="form-actions">
        {/* Submit button text changes based on mode:
            - Edit mode (editingTodo is not null): shows "Save Changes"
            - Create mode (editingTodo is null): shows "Log Task" */}
        <button type="submit">{editingTodo ? "Save Changes" : "Log Task"}</button>

        {/* Cancel button only appears in Edit mode.
            Clicking it calls onCancel (from App.jsx), which sets editingTodo to null,
            triggering the useEffect above to reset the form. */}
        {editingTodo && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
