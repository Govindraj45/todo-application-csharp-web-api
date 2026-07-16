const CATEGORIES = [
  { label: "All", value: "" },
  { label: "View Work", value: "Work" },
  { label: "View Personal", value: "Personal" },
  { label: "Other", value: "Other" }
];

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="category-tabs">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          className={`tab ${activeCategory === cat.value ? "active" : ""}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
