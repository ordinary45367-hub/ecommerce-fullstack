import { useState } from "react";
import "./Categories.css";

const categories = [
  { name: "All Categories", icon: "fa-border-all" },
  { name: "Electronics", icon: "fa-laptop" },
  { name: "Clothing & Apparel", icon: "fa-shirt" },
  { name: "Home & Kitchen", icon: "fa-house" },
  { name: "Sports & Outdoors", icon: "fa-futbol" },
  { name: "Books & Media", icon: "fa-book-open" },
];

function Categories({ OnSelectCategory }) {
  const [active, setActive] = useState("All Categories");
  return (
    <aside className="sidebar">
      <h2>Categories</h2>

      <div className="category-container">
        {categories.map((category) => (
          <div
            className={`category-card ${active === category.name ? "active" : ""}`}
            key={category.name}
            onClick={() => {
              setActive(category.name);
              OnSelectCategory(category.name);
            }}
          >
            <i className={`fa-solid ${category.icon}`}></i>
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Categories;
