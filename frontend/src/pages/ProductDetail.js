import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./productDetail.css";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
const addToCart = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    await axios.post("http://localhost:5000/api/cart/add", {
      userId: user._id,
      productId: product._id
    });
window.dispatchEvent(new Event("cartUpdated"));

    alert("Added to cart ✅");

  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`).then((res) => {
      setProduct(res.data);
      setMainImage(res.data.image || res.data.images[0]);
    });
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  const discountPrice =
    product?.mrp && product?.discount
      ? product.mrp - (product.mrp * product.discount) / 100
      : product?.price || 0;

  return (
    <div className="product-page">
      {/* LEFT IMAGES */}
      <div className="product-images">
        <div className="thumbnail-list">
          {product.images?.map((img, i) => (
            <img key={i} src={img} alt="" onClick={() => setMainImage(img)} />
          ))}
        </div>

        <div className="main-image">
          <img
            src={
              mainImage?.startsWith("http")
                ? mainImage
                : `http://localhost:5000${mainImage}`
            }
            alt={product.name}
          />
        </div>
      </div>

      {/* CENTER DETAILS */}
      <div className="product-info">
        <h2>{product.name}</h2>

        <p className="brand">Brand: {product.brand}</p>

        <div className="rating">
          ⭐ {product.rating} ({product.numReviews} reviews)
        </div>

        <hr />

        <div className="price-section">
          <h3>₹{discountPrice}</h3>

          {product.mrp && (
            <>
              <span className="mrp">₹{product.mrp}</span>
              <span className="discount">{product.discount}% OFF</span>
            </>
          )}
        </div>

        <p className="unit">Unit: {product.unit}</p>

        <p className="desc">{product.description}</p>
      </div>

      {/* RIGHT BUY BOX */}
      <div className="buy-box">
        <h3>₹{discountPrice}</h3>

        <p className="stock">
          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
        </p>

<button className="add-cart" onClick={addToCart}>
  Add to Cart
</button>        <button className="buy-now">Buy Now</button>
      </div>
    </div>
  );
}
