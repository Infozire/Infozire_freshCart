import "./productlist.css";

export default function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <div className="product-card" key={p._id}>
          <img
            src={
              p.image?.startsWith("http")
                ? p.image
                : `http://localhost:5000${p.image}`
            }
            alt={p.name}
          />

          <h4>{p.name}</h4>

          <p className="price">
            ₹{p.price}{" "}
            {p.mrp && <span className="mrp">₹{p.mrp}</span>}
          </p>

          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}