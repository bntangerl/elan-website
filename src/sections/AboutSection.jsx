import { HandHeart, Leaf, PenTool, Recycle, Sparkles } from "lucide-react";
import Logo from "../components/Logo";

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="value-card" data-reveal>
      <div className="icon-box" style={{ marginBottom: 20 }}>
        <Icon size={20} />
      </div>
      <h3>{title}</h3>
      <p className="text-muted" style={{ marginTop: 8 }}>
        {desc}
      </p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container editorial-grid">
        <div className="editorial-card" data-reveal>
          <div className="editorial-logo">
            <Logo
              variant="about"
              className="logo-img about-logo-img"
              fallbackClassName="logo-fallback about-logo-fallback"
            />
          </div>
        </div>

        <div data-reveal>
          <span className="eyebrow">About Elan</span>
          <h2 className="title-md">A softer approach to sustainable fashion.</h2>
          <p className="text-muted" style={{ marginTop: 22 }}>
            Elan transforms discarded plastic bottle caps into handmade bracelets
            with a clean luxury sensibility. Each piece is created to bring
            sustainability into everyday fashion without losing elegance,
            individuality, or modern style.
          </p>

          <div className="story-list">
            <div className="story-item" data-reveal>
              <div className="icon-box">
                <Recycle size={20} />
              </div>
              <div>
                <h3>Recycled Material</h3>
                <p>Plastic bottle caps are collected and reimagined into refined bracelet components.</p>
              </div>
            </div>

            <div className="story-item" data-reveal>
              <div className="icon-box">
                <HandHeart size={20} />
              </div>
              <div>
                <h3>Handmade Process</h3>
                <p>Every bracelet is assembled with a considered, handcrafted touch.</p>
              </div>
            </div>

            <div className="story-item" data-reveal>
              <div className="icon-box">
                <Leaf size={20} />
              </div>
              <div>
                <h3>Eco Movement</h3>
                <p>Elan invites a new generation to wear fashion with more intention.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 70 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">Brand Values</span>
            <h2 className="title-md">Minimal pieces, meaningful values.</h2>
          </div>
        </div>

        <div className="values-grid">
          <ValueCard
            icon={Leaf}
            title="Sustainable"
            desc="Created with recycled plastic bottle caps and a circular fashion mindset."
          />
          <ValueCard
            icon={HandHeart}
            title="Handmade"
            desc="Each bracelet is crafted with care, detail, and human touch."
          />
          <ValueCard
            icon={Sparkles}
            title="Unique"
            desc="No piece feels exactly the same, giving every bracelet its own quiet character."
          />
          <ValueCard
            icon={PenTool}
            title="Customizable"
            desc="Personal details such as initials, colors, and charms make each piece yours."
          />
        </div>
      </div>
    </section>
  );
}
