import ProductShowcase from "../components/ProductShowcase";

export default function ProductsSection({
  products,
  loading,
  addToCart,
  showToast
}) {
  return (
    <section className="section section-soft" id="products">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">Product</span>
            <h2 className="title-md">Designed for conscious self-expression.</h2>
          </div>
          <p>
            Explore Elan’s sustainable bracelet collection through an automatic
            product carousel. Select a category, choose your variant, then continue
            to the Payment menu when you are ready.
          </p>
        </div>

        {loading ? (
          <div className="panel" data-reveal>
            <p className="text-muted">Loading products...</p>
          </div>
        ) : (
          <ProductShowcase
            products={products}
            onAddToCart={addToCart}
            showToast={showToast}
          />
        )}
      </div>
    </section>
  );
}
