import "./categories.css";

export default function CategoriesSection({ categories, onCategoryClick, selectedCategory }) {
  return (
    <div className="category-wrapper">
      <h2 className="section-title">Shop by Category</h2>

      <div className="category-scroll">
        {categories.map((c) => (
          <div
            className={`category-card ${
              selectedCategory === c._id ? "active" : ""
            }`}
            key={c._id}
            onClick={() => onCategoryClick(c._id)}
          >
            <img
              src={
                c.image?.startsWith("http")
                  ? c.image
                  : `http://localhost:5000${c.image}`
              }
              alt={c.name}
            />

            {/* ✅ UPDATED NAME (PRO LOOK) */}
            <p className="category-name">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}