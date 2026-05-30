import { useEffect, useMemo, useState } from "react";

import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import PaymentModal from "./components/PaymentModal";
import Toast from "./components/Toast";

import AboutSection from "./sections/AboutSection";
import EventSection from "./sections/EventSection";
import HeroSection from "./sections/HeroSection";
import ProductsSection from "./sections/ProductsSection";

import { getProducts } from "./services/productService";
import { localProducts } from "./data/products";

function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export default function App() {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState(localProducts);
  const [cart, setCart] = useState(() => storageGet("elan_cart", []));
  const [toast, setToast] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingScreen(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    getProducts()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length) {
          setProducts(data);
        }
      })
      .catch(() => {
        if (mounted) setProducts(localProducts);
      })
      .finally(() => {
        if (mounted) setProductsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);


  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -70px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [productsLoading, products.length]);

  function persistCart(nextCart) {
    setCart(nextCart);
    storageSet("elan_cart", nextCart);
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function addToCart(product, state) {
    const existing = cart.find(
      (item) =>
        item.id === product.id &&
        item.variant === state.variant &&
        (item.notes || "") === (state.notes || "") &&
        Number(item.price || 0) === Number(state.priceOverride || product.price || 0)
    );

    let nextCart;

    if (existing) {
      nextCart = cart.map((item) =>
        item.cartId === existing.cartId
          ? { ...item, qty: item.qty + state.qty }
          : item
      );
    } else {
      nextCart = [
        ...cart,
        {
          cartId:
            window.crypto && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Date.now()),
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: state.priceOverride || product.price,
          variant: state.variant,
          qty: state.qty,
          notes: state.notes || "",
          image: product.images?.[0] || "",
          productType: product.productType || "base",
          selectionMode: state.selectionMode || product.selectionMode || "single",
          showNotes: product.showNotes || product.requiresNotes,
          requiresNotes: product.requiresNotes
        }
      ];
    }

    persistCart(nextCart);
    showToast(`${product.name} has been added to your cart.`);
  }

  function removeCartItem(cartId) {
    persistCart(cart.filter((item) => item.cartId !== cartId));
    showToast("Item removed from your cart.");
  }

  function updateCartItem(cartId, changes) {
    const nextCart = cart.map((item) => {
      if (item.cartId !== cartId) return item;

      const updatedItem = {
        ...item,
        ...changes
      };

      if (changes.qty !== undefined) {
        updatedItem.qty = Math.max(1, Number(changes.qty || 1));
      }

      if (changes.beadCount !== undefined) {
        const nextBeadCount = Math.max(1, Number(changes.beadCount || 1));
        updatedItem.beadCount = nextBeadCount;

        if (item.beadCount) {
          updatedItem.price = nextBeadCount * 2500;
        }
      }

      return updatedItem;
    });

    persistCart(nextCart);
  }

  function clearCart() {
    persistCart([]);
  }

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  return (
    <>
      <Loader hidden={!loadingScreen} />
      <Navbar cartCount={cartCount} onOpenPayment={() => setPaymentOpen(true)} />

      <main className="page">
        <HeroSection />
        <AboutSection />
        <ProductsSection
          products={products}
          loading={productsLoading}
          addToCart={addToCart}
          showToast={showToast}
        />
        <EventSection />
      </main>

      <Footer />

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        cart={cart}
        subtotal={subtotal}
        removeCartItem={removeCartItem}
        updateCartItem={updateCartItem}
        clearCart={clearCart}
        showToast={showToast}
      />

      <Toast message={toast} />
    </>
  );
}
