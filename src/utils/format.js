export function formatPrice(value) {
  return new Intl.NumberFormat("en-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

const braceletColors = [
  "Dark Blue",
  "Gray",
  "Black",
  "Light Blue",
  "Green",
  "Orange",
  "Red",
  "Yellow"
];

const addonColors = [
  "Yellow",
  "Red",
  "Black",
  "White",
  "Green",
  "Blue",
  "Pink",
  "Purple"
];

const initialOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numberOptions = "0123456789".split("");
const initialOrNumberOptions = [...initialOptions, ...numberOptions];

function getProductType(product) {
  const text = String(`${product.slug || ""} ${product.id || ""} ${product.name || ""}`).toLowerCase();

  if (text.includes("initial") || text.includes("number")) return "initial";
  if (text.includes("character")) return "character";
  if (text.includes("beads") || text.includes("color")) return "beads";

  return "default";
}

function inferPrice(product) {
  const type = getProductType(product);

  if (type === "beads") return 50000;
  if (type === "initial") return 2500;
  if (type === "character") return 2500;

  return Number(product.price || 0);
}

function inferVariants(product) {
  const type = getProductType(product);

  if (type === "initial") {
    return initialOrNumberOptions;
  }

  if (type === "character") {
    return ["Star", "Moon", "Doll"];
  }

  if (type === "beads") {
    return braceletColors;
  }

  return Array.isArray(product.variants) ? product.variants : [];
}

function inferOptionGroups(product) {
  const type = getProductType(product);

  if (type === "initial") {
    return [
      {
        label: "Initial Options",
        options: initialOptions
      },
      {
        label: "Number Options",
        options: numberOptions
      }
    ];
  }

  return Array.isArray(product.optionGroups) ? product.optionGroups : [];
}

export function normalizeProduct(product) {
  const type = getProductType(product);
  const isBeads = type === "beads";
  const isInitial = type === "initial";
  const isCharacter = type === "character";
  const isAddon = isInitial || isCharacter;

  return {
    ...product,
    id:
      isInitial
        ? "custom-initial-addon"
        : isCharacter
          ? "character-addon"
          : product.id,
    slug:
      isInitial
        ? "custom-initial-addon"
        : isCharacter
          ? "character-addon"
          : product.slug,
    name:
      isInitial
        ? "Custom Initial / Number Add-on"
        : isCharacter
          ? "Character Add-on"
          : product.name,
    price: inferPrice(product),
    productType: isAddon ? "addon" : "base",
    selectionMode:
      isBeads
        ? "multi_color"
        : isInitial
          ? "initial_color_combo"
          : isCharacter
            ? "character_color_combo"
            : "single",
    priceLabel:
      isBeads
        ? "IDR 50,000 / bracelet"
        : isInitial
          ? "IDR 2,500 / initial or number combination"
          : isCharacter
            ? "IDR 2,500 / character combination"
            : product.priceLabel || product.price_label || "",
    optionsLabel:
      isBeads
        ? "Bracelet Colors"
        : isInitial
          ? "Initial / Number"
          : isCharacter
            ? "Character"
            : product.optionsLabel ?? product.options_label ?? "Variant",
    colorLabel:
      isInitial
        ? "Initial / Number Color"
        : isCharacter
          ? "Character Color"
          : "Color",
    notesLabel:
      isInitial
        ? "Selected Initial / Number Combinations"
        : isCharacter
          ? "Selected Character Combinations"
          : "",
    notesPlaceholder:
      isInitial
        ? "Your selected initials or numbers will appear here automatically. Example: A - Blue or 7 - Pink."
        : isCharacter
          ? "Your selected combinations will appear here automatically. Example: Star - Black."
          : "",
    requiresNotes: false,
    showNotes: Boolean(isInitial || isCharacter),
    quantityLabel:
      isInitial
        ? "Initial / Number Quantity"
        : isCharacter
          ? "Character Quantity"
          : "Quantity",
    pricingMode: "fixed",
    beadPrice: null,
    defaultBeads: null,
    variants: inferVariants(product),
    optionGroups: inferOptionGroups(product),
    colorOptions: isAddon
      ? addonColors
      : Array.isArray(product.colorOptions) && product.colorOptions.length
        ? product.colorOptions
        : braceletColors,
    images: Array.isArray(product.images) ? product.images : []
  };
}
