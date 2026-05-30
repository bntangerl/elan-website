import { Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const menus = [
  { label: "About Us", target: "about" },
  { label: "Product", target: "products" },
  { label: "Event", target: "event" }
];

export default function Navbar({ cartCount = 0, onOpenPayment }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  function scrollToSection(target) {
    const element = document.getElementById(target);
    if (!element) return;

    setOpen(false);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToTop() {
    setOpen(false);
    setActive("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenCart() {
    setOpen(false);
    onOpenPayment?.();
  }

  useEffect(() => {
    function updateActiveSection() {
      const navbarOffset = 130;
      const checkLine = navbarOffset + 80;

      let current = "";

      for (const menu of menus) {
        const element = document.getElementById(menu.target);
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= checkLine && rect.bottom >= checkLine) {
          current = menu.target;
          break;
        }
      }

      // When the check line is between sections, choose the nearest section top.
      if (!current) {
        let nearest = "";
        let nearestDistance = Number.POSITIVE_INFINITY;

        for (const menu of menus) {
          const element = document.getElementById(menu.target);
          if (!element) continue;

          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - checkLine);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = menu.target;
          }
        }

        current = nearest;
      }

      // Do not force Product active while user is still in the hero/top area.
      const firstSection = document.getElementById(menus[0].target);
      if (firstSection && firstSection.getBoundingClientRect().top > checkLine) {
        current = "";
      }

      setActive(current);
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="navbar" id="navbar">
      <div className="nav-inner">
        <button className="logo-mark" onClick={scrollToTop} aria-label="Elan home">
          <Logo variant="navbar" className="logo-img navbar-logo-img" />
        </button>

        <nav className={`nav-menu ${open ? "open" : ""}`}>
          {menus.map((menu) => (
            <button
              className={`nav-link ${active === menu.target ? "active" : ""}`}
              onClick={() => scrollToSection(menu.target)}
              key={menu.target}
            >
              {menu.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="cart-btn" onClick={handleOpenCart} aria-label="Open cart and payment">
            <ShoppingBag size={19} />
            <span className="cart-count">{cartCount}</span>
          </button>

          <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
