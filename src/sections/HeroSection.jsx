import { ArrowRight, CalendarDays } from "lucide-react";

export default function HeroSection() {
  function scrollToSection(target) {
    const element = document.getElementById(target);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy" data-reveal>
          <span className="eyebrow">Sustainable Jewelry</span>
          <h1 className="title-lg">Turning Plastic Into Timeless Jewelry</h1>
          <p>
            Handcrafted sustainable bracelets made from recycled bottle caps,
            designed for conscious modern living.
          </p>

          <div className="hero-actions">
            <button className="btn btn-dark" onClick={() => scrollToSection("products")}>
              Explore Products
              <ArrowRight size={18} />
            </button>

            <button className="btn btn-light" onClick={() => scrollToSection("event")}>
              Upcoming Event
              <CalendarDays size={18} />
            </button>
          </div>

          <div className="hero-meta">
            <div className="meta-card" data-reveal>
              <strong>01</strong>
              <span>Plastic caps reimagined into wearable objects.</span>
            </div>
            <div className="meta-card" data-reveal>
              <strong>03</strong>
              <span>Signature bracelet categories for modern styling.</span>
            </div>
            <div className="meta-card" data-reveal>
              <strong>∞</strong>
              <span>Designed for circular fashion and mindful living.</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" data-reveal>
          <div className="hero-image-card"></div>
          <div className="floating-card">
            <small>Elan Studio</small>
            <h3>Clean jewelry with a conscious soul.</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
