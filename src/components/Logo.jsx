import { config } from "../config";

function getLogoUrl(variant) {
  if (variant === "navbar") return config.navbarLogoUrl;
  if (variant === "about") return config.aboutLogoUrl;
  if (variant === "footer") return config.footerLogoUrl;

  return config.elanLogoUrl;
}

export default function Logo({
  variant = "navbar",
  className = "logo-img",
  fallbackClassName = "logo-fallback"
}) {
  const logoUrl = getLogoUrl(variant);

  if (logoUrl) {
    return <img className={className} src={logoUrl} alt="Elan logo" />;
  }

  return (
    <span className={fallbackClassName}>
      Elan
      <span></span>
    </span>
  );
}
