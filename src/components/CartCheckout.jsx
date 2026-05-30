import { ImageUp, QrCode, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { config } from "../config";
import { createOrder } from "../services/orderService";
import { formatPrice } from "../utils/format";

export default function CartCheckout({
  cart,
  subtotal,
  removeCartItem,
  clearCart,
  showToast
}) {
  const [customerName, setCustomerName] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function sendPaymentProof() {
    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }

    if (!customerName.trim()) {
      showToast("Please write your customer name before sending confirmation.");
      return;
    }

    setSubmitting(true);

    try {
      await createOrder({
        customerName: customerName.trim(),
        whatsappNumber: "",
        total: subtotal,
        cart,
        paymentProofFile
      });

      const items = cart
        .map((item) => {
          const notes = item.notes ? ` | Customization: ${item.notes}` : "";
          return `- ${item.name} (${item.variant}) x${item.qty} = ${formatPrice(
            item.price * item.qty
          )}${notes}`;
        })
        .join("%0A");

      const message =
        `Hello Elan,%0A%0A` +
        `I would like to confirm my payment.%0A%0A` +
        `Customer Name: ${encodeURIComponent(customerName)}%0A` +
        `Ordered Items:%0A${items}%0A%0A` +
        `Total Payment: ${encodeURIComponent(formatPrice(subtotal))}%0A%0A` +
        `I will send my payment proof here. Thank you.`;

      showToast("Order saved successfully.");
      window.open(`https://wa.me/${config.whatsappOwner}?text=${message}`, "_blank");
      clearCart();
      setCustomerName("");
      setPaymentProofFile(null);
    } catch (error) {
      showToast(error.message || "Failed to save order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container checkout-layout checkout-anchor" id="checkout">
      <div className="panel" data-reveal>
        <h2 className="title-sm">Selected Items</h2>

        {cart.length ? (
          cart.map((item) => (
            <div className="cart-item" key={item.cartId}>
              <div
                className="cart-img"
                style={{ backgroundImage: `url('${item.image}')` }}
              ></div>

              <div>
                <h3>{item.name}</h3>
                <p>Variant: {item.variant}</p>
                <p>Quantity: {item.qty}</p>
                {item.notes ? <p>Customization: {item.notes}</p> : null}
                <p style={{ marginTop: 8 }}>
                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </p>
              </div>

              <button className="remove-btn" onClick={() => removeCartItem(item.cartId)}>
                <Trash2 size={19} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <ShoppingBag size={42} />
            <h3>Your cart is currently empty.</h3>
            <p>Choose your favorite Elan piece from the product section.</p>
          </div>
        )}
      </div>

      <aside className="panel" data-reveal>
        <h2 className="title-sm">Checkout</h2>

        <div style={{ margin: "22px 0" }}>
          <div className="summary-row total">
            <span>Total Payment</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
        </div>

        <h3 style={{ marginBottom: 14 }}>QRIS Payment</h3>

        <div className="qris-box">
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

          <button className="btn btn-dark btn-full" onClick={sendPaymentProof} disabled={submitting}>
            {submitting ? "Saving Order..." : "Send Payment Proof"}
            <Send size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}
