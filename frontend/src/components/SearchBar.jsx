export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrapper">
      <label htmlFor="todo-search" className="sr-only">Search todos</label>
      <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        id="todo-search"
        className="search-bar"
        type="search"
        placeholder="Search todos by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
