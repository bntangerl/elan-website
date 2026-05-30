import {
  CalendarDays,
  ExternalLink,
  Leaf,
  MapPin,
  Navigation,
  Sparkles
} from "lucide-react";
import Countdown from "../components/Countdown";
import { config } from "../config";

export default function EventSection() {
  return (
    <section className="section" id="event">
      <div className="container">
        <div className="event-banner" data-reveal>
          <div className="event-banner-content">
            <span className="eyebrow">Upcoming Event</span>
            <h2 className="title-lg">Eco Bracelet Open Booth</h2>
            <p
              style={{
                marginTop: 20,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 620
              }}
            >
              A sustainable jewelry pop-up experience by Elan, bringing handmade
              recycled bracelet pieces into a clean lifestyle setting.
            </p>
          </div>
        </div>
      </div>

      <div className="container event-card" style={{ marginTop: 34 }} data-reveal>
        <div className="event-content">
          <span className="badge">
            <CalendarDays size={15} /> 13 June 2026
          </span>

          <h2 className="title-md">Sustainable Jewelry Pop-Up Experience</h2>

          <div className="event-info">
            <a
              className="info-line event-location-link"
              href={config.eventMapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${config.eventLocation} in Google Maps`}
            >
              <MapPin size={18} /> {config.eventLocation}
            </a>
            <div className="info-line">
              <Sparkles size={18} /> Handmade bracelet showcase and styling experience
            </div>
            <div className="info-line">
              <Leaf size={18} /> Eco-conscious fashion activation
            </div>
          </div>

          <Countdown />

          <div className="event-actions">
            <a className="btn btn-dark" href={config.eventFormUrl} target="_blank" rel="noreferrer">
              Register Now
              <ExternalLink size={18} />
            </a>

            <a className="btn btn-light" href={config.eventMapsUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
              <Navigation size={18} />
            </a>
          </div>
        </div>

        <div className="map-preview map-preview-embed">
          <iframe
            title={`Google Maps location for ${config.eventLocation}`}
            src={config.eventMapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>

          <div className="map-overlay-label">
            <MapPin size={16} />
            <span>{config.eventLocation}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
