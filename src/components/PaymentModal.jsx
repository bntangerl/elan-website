import {
  ArrowLeft,
  CreditCard,
  ImageUp,
  Minus,
  Plus,
  QrCode,
  Send,
  ShoppingBag,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { config } from "../config";
import { createOrder } from "../services/orderService";
import { formatPrice } from "../utils/format";


function getCleanWhatsAppNumber() {
  return String(config.whatsappOwner || "").replace(/\D/g, "");
}

function createWhatsAppUrl(message) {
  const phone = getCleanWhatsAppNumber();

  if (!phone) {
    throw new Error("WhatsApp owner number is not configured.");
  }

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

function openWhatsAppConfirmation(message) {
  const url = createWhatsAppUrl(message);
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    window.location.href = url;
    return;
  }

  const popup = window.open(url, "_blank", "noopener,noreferrer");

  if (!popup) {
    window.location.href = url;
  }
}

function formatCustomizationNotes(notes) {
  if (!notes) return "";

  const lines = notes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";

  const formattedLines = lines
    .map((line, index) => `   ${index + 1}. ${line}`)
    .join("\n");

  return `\n   Customization:\n${formattedLines}`;
}

function formatOrderItems(cart) {
  return cart
    .map((item, index) => {
      const customizationText = formatCustomizationNotes(item.notes);

      return `${index + 1}. ${item.name}
   Selection: ${item.variant}
   Quantity: ${item.qty}
   Price: ${formatPrice(item.price * item.qty)}${customizationText}`;
    })
    .join("\n\n");
}


export default function PaymentModal({
  open,
  onClose,
  cart,
  subtotal,
  removeCartItem,
  updateCartItem,
  clearCart,
  showToast
}) {
  const [step, setStep] = useState("cart");
  const [customerName, setCustomerName] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + Number(item.qty || 0), 0),
    [cart]
  );

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
      setStep("cart");
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleClose() {
    setStep("cart");
    onClose();
  }

  function continueToPayment() {
    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }

    setStep("payment");
  }

  async function sendPaymentProof() {
    if (!cart.length) {
      showToast("Your cart is empty.");
      setStep("cart");
      return;
    }

    if (!customerName.trim()) {
      showToast("Please write your customer name before sending confirmation.");
      return;
    }

    if (!paymentProofFile) {
      showToast("Please upload your payment proof before sending confirmation.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        whatsappNumber: "",
        total: subtotal,
        cart,
        paymentProofFile
      });

      const items = formatOrderItems(cart);

      const message =
        `Hello Elan,\n\n` +
        `I would like to confirm my payment.\n\n` +
        `Order ID: ${order.id}\n` +
        `Customer Name: ${customerName.trim()}\n` +
        `Ordered Items:\n${items}\n\n` +
        `Total Payment: ${formatPrice(subtotal)}\n\n` +
        `Payment Proof Link:\n${order.paymentProofUrl || "Payment proof uploaded, but link is unavailable."}\n\n` +
        `Thank you.`;

      showToast("Order saved. Opening WhatsApp confirmation.");

      clearCart();
      setCustomerName("");
      setPaymentProofFile(null);
      handleClose();

      openWhatsAppConfirmation(message);
    } catch (error) {
      showToast(error.message || "Failed to save order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="payment-modal-backdrop" role="dialog" aria-modal="true">
      <div className="payment-modal cart-step-modal">
        <button className="payment-modal-close" onClick={handleClose} aria-label="Close cart popup">
          <X size={20} />
        </button>

        <div className="cart-step-header">
          <div>
            <span className="eyebrow">{step === "cart" ? "Cart" : "Payment"}</span>
            <h2 className="title-md">
              {step === "cart" ? "Cart" : "Complete your payment."}
            </h2>
            <p className="text-muted">
              {step === "cart"
                ? "Review your items, edit customization details, then continue to payment."
                : "Scan the QRIS code, upload your payment proof, then confirm through WhatsApp."}
            </p>
          </div>

          <div className="cart-step-indicator">
            <span className={step === "cart" ? "active" : ""}>1. Review</span>
            <span className={step === "payment" ? "active" : ""}>2. Payment</span>
          </div>
        </div>

        {step === "cart" ? (
          <div className="cart-review-layout">
            <div className="cart-review-panel">
              <div className="cart-review-title">
                <h3 className="title-sm">Review Items + Edit</h3>
                <span>{cartCount} item{cartCount > 1 ? "s" : ""}</span>
              </div>

              {cart.length ? (
                <div className="cart-edit-list">
                  {cart.map((item) => (
                    <article className="cart-edit-item" key={item.cartId}>
                      <div
                        className="cart-edit-img"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      ></div>

                      <div className="cart-edit-content">
                        <div className="cart-edit-top">
                          <div>
                            <h4>{item.name}</h4>
                            <p>Selection: {item.variant}</p>
                          </div>

                          <button
                            className="remove-btn"
                            onClick={() => removeCartItem(item.cartId)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="cart-edit-grid cart-edit-grid-simple">
                          <div>
                            <label className="field-label">Quantity</label>

                            {(item.selectionMode === "character_color_combo" || item.selectionMode === "initial_color_combo") ? (
                              <div className="readonly-cart-qty">
                                <strong>{item.qty}</strong>
                                <small>Based on selected combinations</small>
                              </div>
                            ) : (
                              <div className="qty-control">
                                <button
                                  onClick={() =>
                                    updateCartItem(item.cartId, {
                                      qty: Number(item.qty || 1) - 1
                                    })
                                  }
                                >
                                  <Minus size={15} />
                                </button>
                                <span>{item.qty}</span>
                                <button
                                  onClick={() =>
                                    updateCartItem(item.cartId, {
                                      qty: Number(item.qty || 1) + 1
                                    })
                                  }
                                >
                                  <Plus size={15} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {item.notes || item.requiresNotes || item.showNotes ? (
                          <div>
                            <label className="field-label">
                              {(item.selectionMode === "character_color_combo" || item.selectionMode === "initial_color_combo")
                                ? "Selected Combinations"
                                : "Notes / Custom Color"}
                            </label>
                            <textarea
                              value={item.notes || ""}
                              readOnly={(item.selectionMode === "character_color_combo" || item.selectionMode === "initial_color_combo")}
                              placeholder="Write customization notes, color, initials, or character details."
                              onChange={(event) =>
                                updateCartItem(item.cartId, {
                                  notes: event.target.value
                                })
                              }
                            ></textarea>
                            {(item.selectionMode === "character_color_combo" || item.selectionMode === "initial_color_combo") ? (
                              <small className="field-help">
                                To change combinations, remove this item and add the add-on again.
                              </small>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="cart-edit-bottom">
                          <span>Subtotal</span>
                          <strong>{formatPrice(item.price * item.qty)}</strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state payment-empty">
                  <ShoppingBag size={42} />
                  <h3>Your cart is empty.</h3>
                  <p>Please choose a product before opening payment.</p>
                </div>
              )}
            </div>

            <aside className="cart-summary-card">
              <span className="eyebrow">Order Summary</span>
              <div className="summary-row">
                <span>Total Items</span>
                <strong>{cartCount}</strong>
              </div>
              <div className="summary-row total">
                <span>Total Payment</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <button className="btn btn-dark btn-full" onClick={continueToPayment}>
                Continue to Payment
                <CreditCard size={18} />
              </button>
            </aside>
          </div>
        ) : (
          <div className="payment-step-layout">
            <button className="product-back-btn" onClick={() => setStep("cart")}>
              <ArrowLeft size={17} />
              Back to Cart
            </button>

            <div className="payment-step-grid">
              <div className="payment-panel">
                <h3 className="title-sm">QRIS Payment</h3>

                <div className="qris-box payment-qris-box">
                  {config.qrisImageUrl ? (
                    <img src={config.qrisImageUrl} alt="QRIS payment code" />
                  ) : (
                    <div className="qris-placeholder">
                      <QrCode size={46} />
                      <p style={{ marginTop: 12 }}>
                        Place your QRIS image URL in <strong>VITE_QRIS_IMAGE_URL</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="payment-panel">
                <h3 className="title-sm">Payment Confirmation</h3>

                <div className="mini-order-summary">
                  <div className="summary-row">
                    <span>Total Items</span>
                    <strong>{cartCount}</strong>
                  </div>
                  <div className="summary-row total">
                    <span>Total Payment</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>
                </div>

                <div className="inline-form-grid" style={{ marginTop: 22 }}>
                  <div>
                    <label className="field-label">Customer Name</label>
                    <input
                      placeholder="Write your full name"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                  </div>

                  <div>
                    <label className="field-label">Payment Proof</label>

                    <div className={`upload-box ${paymentProofFile ? "has-file" : ""}`}>
                      <input
                        id="paymentProof"
                        className="upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(event) => setPaymentProofFile(event.target.files?.[0] || null)}
                      />

                      <label className="upload-label" htmlFor="paymentProof">
                        <span className="upload-icon">
                          <ImageUp size={24} />
                        </span>

                        <span className="upload-copy">
                          <strong>
                            {paymentProofFile ? paymentProofFile.name : "Upload payment proof"}
                          </strong>
                          <small>
                            {paymentProofFile
                              ? "Click to replace the selected image"
                              : "PNG, JPG, or JPEG up to 2MB"}
                          </small>
                        </span>
                      </label>

                      {paymentProofFile ? (
                        <button
                          type="button"
                          className="upload-remove"
                          onClick={() => setPaymentProofFile(null)}
                          aria-label="Remove selected payment proof"
                        >
                          <X size={17} />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <button
                    className="btn btn-dark btn-full"
                    onClick={sendPaymentProof}
                    disabled={submitting}
                  >
                    {submitting ? "Saving Order..." : "Confirm Payment via WhatsApp"}
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
