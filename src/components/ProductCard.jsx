import { ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { formatPrice } from "../utils/format";

export default function ProductCard({ product, onAddToCart, showToast }) {
  const firstVariant = useMemo(() => product.variants?.[0] || "Default", [product]);
  const [variant, setVariant] = useState(firstVariant);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (product.requiresNotes && !notes.trim()) {
      setError("Please complete your customization details before adding this item to cart.");
      showToast("Please complete your customization details before adding this item to cart.");
      return;
    }

    setError("");
    onAddToCart(product, { variant, qty, notes });
  }

  return (
    <article className="product-card" data-reveal>
      <div
        className="product-img"
        style={{ backgroundImage: `url('${product.images?.[0] || ""}')` }}
      ></div>

      <div className="product-body">
        <div className="product-top">
          <h3 className="product-name">{product.name}</h3>
          <span className="price">{formatPrice(product.price)}</span>
        </div>

        <p className="product-desc">{product.description}</p>

        <div className="variant-wrap">
          <div>
            <label className="field-label">{product.optionsLabel}</label>
            <div className="variant-options">
              {(product.variants || []).map((item) => (
                <button
                  className={`chip ${variant === item ? "active" : ""}`}
                  onClick={() => setVariant(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          {product.requiresNotes ? (
            <div>
              <label className="field-label">Customization Notes</label>
              <textarea
                placeholder="Write your initial letters, beads colors, and preferred details."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              ></textarea>
              <div className={`error ${error ? "show" : ""}`}>{error}</div>
            </div>
          ) : null}

          <button className="btn btn-dark btn-full" onClick={handleAdd}>
            Add to Cart
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
