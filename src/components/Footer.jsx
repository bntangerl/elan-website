import { config } from "../config";
import Logo from "./Logo";

export default function Footer() {
  function scrollToSection(target) {
    const element = document.getElementById(target);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column footer-brand">
            <div className="logo-mark footer-logo-mark">
              <Logo
                variant="footer"
                className="logo-img footer-logo-img"
                fallbackClassName="logo-fallback footer-logo-fallback"
              />
            </div>
            <p>
              Handcrafted sustainable bracelets made from recycled bottle caps,
              designed for conscious modern living.
            </p>
          </div>

          <div className="footer-column footer-nav-column">
            <h3>Explore</h3>
            <div className="footer-links footer-menu-links">
              <button type="button" onClick={() => scrollToSection("about")}>
                About Us
              </button>
              <button type="button" onClick={() => scrollToSection("products")}>
                Product
              </button>
              <button type="button" onClick={() => scrollToSection("event")}>
                Event
              </button>
            </div>
          </div>

          <div className="footer-column footer-connect-column">
            <h3>Connect</h3>
            <div className="footer-links">
              <a href="https://www.instagram.com/elan.idn" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={`https://wa.me/${config.whatsappOwner}`} target="_blank" rel="noreferrer">
                WhatsApp Owner
              </a>
              <span>Made for mindful fashion and cleaner living.</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Elan. All rights reserved.</span>
          <span>Turning waste into wearable elegance.</span>
        </div>
      </div>
    </footer>
  );
}
