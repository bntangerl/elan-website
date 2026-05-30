const eventLocation = "Chillax Sudirman, Jakarta";
const encodedEventLocation = encodeURIComponent(eventLocation);

export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  whatsappOwner: import.meta.env.VITE_WHATSAPP_OWNER || "6281234567890",
  qrisImageUrl: import.meta.env.VITE_QRIS_IMAGE_URL || "",

  // Global fallback logo
  elanLogoUrl: import.meta.env.VITE_ELAN_LOGO_URL || "",

  // Optional separate logos
  navbarLogoUrl:
    import.meta.env.VITE_ELAN_NAVBAR_LOGO_URL ||
    import.meta.env.VITE_ELAN_LOGO_URL ||
    "",
  aboutLogoUrl:
    import.meta.env.VITE_ELAN_ABOUT_LOGO_URL ||
    import.meta.env.VITE_ELAN_LOGO_URL ||
    "",
  footerLogoUrl:
    import.meta.env.VITE_ELAN_FOOTER_LOGO_URL ||
    import.meta.env.VITE_ELAN_LOGO_URL ||
    "",

  eventFormUrl:
    import.meta.env.VITE_EVENT_FORM_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLSdTS_7wrEYAWrKuxPo6bXNX72qUbOL-Qrp93eEfnKxAty8oog/viewform",
  eventDate: "2026-06-13T10:00:00+07:00",

  eventLocation,
  eventMapsEmbedUrl:
    import.meta.env.VITE_EVENT_MAPS_EMBED_URL ||
    `https://www.google.com/maps?q=${encodedEventLocation}&output=embed`,
  eventMapsUrl:
    import.meta.env.VITE_EVENT_MAPS_URL ||
    `https://www.google.com/maps/search/?api=1&query=${encodedEventLocation}`
};
