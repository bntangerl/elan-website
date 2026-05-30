export const braceletColors = [
  "Dark Blue",
  "Gray",
  "Black",
  "Light Blue",
  "Green",
  "Orange",
  "Red",
  "Yellow"
];

export const initialLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const localProducts = [
  {
    id: "beads-color-bracelet",
    slug: "beads-color-bracelet",
    name: "Beads Color Bracelet",
    price: 50000,
    productType: "base",
    selectionMode: "multi_color",
    priceLabel: "IDR 50,000 / bracelet",
    description:
      "Handcrafted color beads bracelet with 18 beads. Choose one or more bracelet colors from the available options.",
    short:
      "Main bracelet, 18 beads, multiple color selection available.",
    optionsLabel: "Bracelet Colors",
    notesLabel: "",
    notesPlaceholder: "",
    variants: braceletColors,
    colorOptions: braceletColors,
    requiresNotes: false,
    showNotes: false,
    quantityLabel: "Quantity",
    images: [
      "/bracelet-color.png"
    ]
  },
  {
    id: "custom-initial-addon",
    slug: "custom-initial-addon",
    name: "Custom Initial Add-on",
    price: 2500,
    productType: "addon",
    selectionMode: "initial_color_combo",
    priceLabel: "IDR 2,500 / initial combination",
    description:
      "Optional initial add-on for your bracelet. Choose an initial from A-Z and choose its color, then add it as a combination.",
    short:
      "Add-on initial letters from A-Z with color combination.",
    optionsLabel: "Initial",
    colorLabel: "Initial Color",
    notesLabel: "Selected Initial Combinations",
    notesPlaceholder:
      "Your selected initials will appear here automatically. Example: A - Blue.",
    variants: initialLetters,
    colorOptions: braceletColors,
    requiresNotes: false,
    showNotes: true,
    quantityLabel: "Initial Quantity",
    images: [
      "/bracelet-initial.png"
    ]
  },
  {
    id: "character-addon",
    slug: "character-addon",
    name: "Character Add-on",
    price: 2500,
    productType: "addon",
    selectionMode: "character_color_combo",
    priceLabel: "IDR 2,500 / character combination",
    description:
      "Optional character add-on for your bracelet. Choose a character and color, then add it as a combination.",
    short:
      "Add-on character charm, choose character and color combination.",
    optionsLabel: "Character",
    colorLabel: "Character Color",
    notesLabel: "Selected Character Combinations",
    notesPlaceholder:
      "Your selected combinations will appear here automatically. Example: Star - Black.",
    variants: ["Star", "Moon", "Doll"],
    colorOptions: braceletColors,
    requiresNotes: false,
    showNotes: true,
    quantityLabel: "Character Quantity",
    images: [
      "/bracelet-character.png"
    ]
  }
];
