import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingBag,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "../utils/format";

function getFinalProductPrice(product) {
  return Number(product?.price || 0);
}

function combosToNotes(combos) {
  return combos.join("\n");
}

function getComboWord(product) {
  if (product?.selectionMode === "initial_color_combo") return "initial or number";
  if (product?.selectionMode === "character_color_combo") return "character";
  return "item";
}

function getComboTitle(product) {
  if (product?.selectionMode === "initial_color_combo") return "Initial / Number";
  if (product?.selectionMode === "character_color_combo") return "Character";
  return "Item";
}

export default function ProductShowcase({ products, onAddToCart, showToast }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState("categories");

  const selectedProduct = products[selectedIndex] || products[0];

  const [variant, setVariant] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [comboColor, setComboColor] = useState("");
  const [combos, setCombos] = useState([]);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const finalPrice = getFinalProductPrice(selectedProduct);
  const isMultiColor = selectedProduct?.selectionMode === "multi_color";
  const isCombo =
    selectedProduct?.selectionMode === "character_color_combo" ||
    selectedProduct?.selectionMode === "initial_color_combo";
  const isAddon = selectedProduct?.productType === "addon";
  const comboWord = getComboWord(selectedProduct);
  const comboTitle = getComboTitle(selectedProduct);

  useEffect(() => {
    if (!products.length || modalOpen) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [products.length, modalOpen]);

  useEffect(() => {
    if (!selectedProduct) return;

    setVariant(selectedProduct.variants?.[0] || "Default");
    setSelectedColors([]);
    setComboColor(selectedProduct.colorOptions?.[0] || "Black");
    setCombos([]);
    setQty(1);
    setNotes("");
    setError("");
  }, [selectedProduct?.id, selectedProduct?.slug, selectedProduct?.selectionMode]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    if (modalOpen) {
      document.body.classList.add("modal-open");
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalOpen]);

  const trackStyle = useMemo(() => {
    return {
      transform: `translateX(-${activeIndex * 100}%)`
    };
  }, [activeIndex]);

  function goPrev() {
    setActiveIndex((current) => (current - 1 + products.length) % products.length);
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % products.length);
  }

  function openCategoryModal() {
    setModalView("categories");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalView("categories");
    setError("");
  }

  function selectProduct(index) {
    setSelectedIndex(index);
    setActiveIndex(index);
    setModalView("detail");
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function toggleColor(color) {
    setSelectedColors((current) => {
      if (current.includes(color)) {
        return current.filter((item) => item !== color);
      }

      return [...current, color];
    });
  }

  function addCombination() {
    if (!variant || !comboColor) {
      const message = `Please choose a ${comboWord} and color first.`;
      setError(message);
      showToast(message);
      return;
    }

    const nextCombos = [...combos, `${variant} - ${comboColor}`];
    setCombos(nextCombos);
    setNotes(combosToNotes(nextCombos));
    setQty(nextCombos.length);
    setError("");
  }

  function removeCombination(index) {
    const nextCombos = combos.filter((_, itemIndex) => itemIndex !== index);
    setCombos(nextCombos);
    setNotes(combosToNotes(nextCombos));
    setQty(Math.max(1, nextCombos.length));
    setError("");
  }

  function handleAddToCart() {
    if (!selectedProduct) return;

    const finalVariant = isMultiColor
      ? selectedColors.slice().sort().join(", ")
      : isCombo
        ? `${comboTitle} Color Combinations`
        : variant;

    const finalQty = isCombo ? combos.length : qty;
    const finalNotes = isCombo ? combosToNotes(combos) : notes;

    if (isMultiColor && selectedColors.length === 0) {
      const message = "Please choose at least one bracelet color.";
      setError(message);
      showToast(message);
      return;
    }

    if (isCombo && combos.length === 0) {
      const message = `Please add at least one ${comboWord} and color combination.`;
      setError(message);
      showToast(message);
      return;
    }

    if (selectedProduct.requiresNotes && !finalNotes.trim()) {
      const message = "Please write your customization request in the notes before adding this item.";
      setError(message);
      showToast(message);
      return;
    }

    setError("");
    onAddToCart(selectedProduct, {
      variant: finalVariant,
      qty: finalQty,
      notes: finalNotes,
      priceOverride: finalPrice,
      selectionMode: selectedProduct.selectionMode
    });
    closeModal();
  }

  const modalMarkup = modalOpen ? (
    <div
      className="product-modal-backdrop product-modal-backdrop-fixed"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={`product-modal ${modalView === "detail" ? "product-modal-wide" : ""}`}>
        <button
          className="product-modal-close"
          onClick={closeModal}
          aria-label="Close product popup"
        >
          <X size={20} />
        </button>

        {modalView === "categories" ? (
          <>
            <div className="product-modal-head">
              <span className="eyebrow">Choose Category</span>
              <h2 className="title-md">Select your Elan item.</h2>
              <p className="text-muted">
                Choose the main bracelet or add optional initial and character add-ons.
              </p>
            </div>

            <div className="product-modal-grid">
              {products.map((product, index) => (
                <button
                  className="product-modal-card"
                  onClick={() => selectProduct(index)}
                  key={product.id}
                >
                  <span
                    className="product-modal-img"
                    style={{ backgroundImage: `url('${product.images?.[0] || ""}')` }}
                  ></span>

                  <span className="product-modal-content">
                    <strong>{product.name}</strong>
                    <small>{product.short || product.description}</small>
                    <span className="product-modal-action">
                      View Product
                      <ArrowRight size={15} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="product-back-btn" onClick={() => setModalView("categories")}>
              <ArrowLeft size={17} />
              Back to Categories
            </button>

            <div className="product-modal-detail">
              <div
                className="product-modal-detail-img"
                style={{
                  backgroundImage: `url('${selectedProduct.images?.[0] || ""}')`
                }}
              ></div>

              <div className="product-modal-detail-content">
                <span className="eyebrow">{isAddon ? "Add-on Detail" : "Product Detail"}</span>
                <h2 className="title-md">{selectedProduct.name}</h2>
                <p className="text-muted" style={{ marginTop: 18 }}>
                  {selectedProduct.description}
                </p>

                <p className="price" style={{ fontSize: 22, marginTop: 18 }}>
                  {formatPrice(finalPrice)}
                </p>

                <p className="text-muted" style={{ marginTop: 6, fontSize: 13 }}>
                  {selectedProduct.priceLabel ||
                    (isAddon
                      ? "Add-on price. Add this together with your bracelet."
                      : "Base bracelet price.")}
                </p>

                <div className="variant-wrap">
                  {isCombo ? (
                    <>
                      <div>
                        <label className="field-label">{selectedProduct.optionsLabel}</label>

                        {selectedProduct.optionGroups?.length ? (
                          <div className="option-group-stack">
                            {selectedProduct.optionGroups.map((group) => (
                              <div className="option-group" key={group.label}>
                                <small>{group.label}</small>
                                <div className="variant-options letter-options">
                                  {(group.options || []).map((item) => (
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
                            ))}
                          </div>
                        ) : (
                          <div className="variant-options letter-options">
                            {(selectedProduct.variants || []).map((item) => (
                              <button
                                className={`chip ${variant === item ? "active" : ""}`}
                                onClick={() => setVariant(item)}
                                key={item}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="field-label">
                          {selectedProduct.colorLabel || `${comboTitle} Color`}
                        </label>
                        <div className="variant-options">
                          {(selectedProduct.colorOptions || []).map((item) => (
                            <button
                              className={`chip ${comboColor === item ? "active" : ""}`}
                              onClick={() => setComboColor(item)}
                              key={item}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button className="btn btn-light combo-add-btn" onClick={addCombination}>
                        <Plus size={17} />
                        Add Combination
                      </button>

                      <div>
                        <label className="field-label">{selectedProduct.notesLabel}</label>

                        {combos.length ? (
                          <div className="combo-chip-list">
                            {combos.map((combo, index) => (
                              <span className="combo-chip" key={`${combo}-${index}`}>
                                <button
                                  type="button"
                                  onClick={() => removeCombination(index)}
                                  aria-label={`Remove ${combo}`}
                                >
                                  <X size={13} />
                                </button>
                                {combo}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="combo-empty">No combination added yet.</p>
                        )}

                        <textarea
                          className="combo-notes-area"
                          readOnly
                          placeholder={selectedProduct.notesPlaceholder}
                          value={notes}
                        ></textarea>
                        <small className="field-help">
                          Quantity automatically follows selected combinations.
                        </small>
                        <div className={`error ${error ? "show" : ""}`}>{error}</div>
                      </div>

                      <div className="readonly-qty-card">
                        <span>{selectedProduct.quantityLabel || "Quantity"}</span>
                        <strong>{combos.length}</strong>
                        <small>
                          {formatPrice(finalPrice)} × {combos.length || 0} combination
                        </small>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="field-label">{selectedProduct.optionsLabel}</label>

                        {isMultiColor ? (
                          <>
                            <div className="variant-options">
                              {(selectedProduct.variants || []).map((item) => (
                                <button
                                  className={`chip ${selectedColors.includes(item) ? "active" : ""}`}
                                  onClick={() => toggleColor(item)}
                                  key={item}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                            <small className="field-help">
                              You can choose more than one color.
                            </small>
                          </>
                        ) : (
                          <div className="variant-options">
                            {(selectedProduct.variants || []).map((item) => (
                              <button
                                className={`chip ${variant === item ? "active" : ""}`}
                                onClick={() => setVariant(item)}
                                key={item}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="field-label">
                          {selectedProduct.quantityLabel || "Quantity"}
                        </label>
                        <div className="qty-control">
                          <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                          <span>{qty}</span>
                          <button onClick={() => setQty(qty + 1)}>+</button>
                        </div>
                        {isAddon ? (
                          <small className="field-help">
                            Add-ons are calculated as {formatPrice(finalPrice)} × quantity.
                          </small>
                        ) : null}
                      </div>

                      {selectedProduct.showNotes || selectedProduct.requiresNotes ? (
                        <div>
                          <label className="field-label">
                            {selectedProduct.notesLabel || "Customization Notes"}
                          </label>
                          <textarea
                            placeholder={
                              selectedProduct.notesPlaceholder ||
                              "Write your customization details."
                            }
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                          ></textarea>
                          <div className={`error ${error ? "show" : ""}`}>{error}</div>
                        </div>
                      ) : (
                        <div className={`error ${error ? "show" : ""}`}>{error}</div>
                      )}
                    </>
                  )}

                  <button className="btn btn-dark" onClick={handleAddToCart}>
                    Add to Cart
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;

  if (!products.length) {
    return (
      <div className="panel">
        <p className="text-muted">No products available.</p>
      </div>
    );
  }

  return (
    <div className="product-showcase" data-reveal>
      <div className="product-slider">
        <div className="product-slider-track" style={trackStyle}>
          {products.map((product) => (
            <article className="product-slide" key={product.id}>
              <div
                className="product-slide-image"
                style={{ backgroundImage: `url('${product.images?.[0] || ""}')` }}
              >
                <div className="product-slide-center">
                  <span className="eyebrow">Elan Collection</span>
                  <h3>{product.name}</h3>
                  <p>{product.short || product.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="product-floating-cta">
          <button className="btn btn-light product-see-btn" onClick={openCategoryModal}>
            See Product
            <ArrowRight size={18} />
          </button>
        </div>

        <button className="slider-arrow slider-arrow-left" onClick={goPrev} aria-label="Previous product">
          <ChevronLeft size={24} />
        </button>

        <button className="slider-arrow slider-arrow-right" onClick={goNext} aria-label="Next product">
          <ChevronRight size={24} />
        </button>

        <div className="slider-dots">
          {products.map((product, index) => (
            <button
              className={`slider-dot ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${product.name}`}
              key={product.id}
            ></button>
          ))}
        </div>
      </div>

      {modalOpen && createPortal(modalMarkup, document.body)}
    </div>
  );
}
