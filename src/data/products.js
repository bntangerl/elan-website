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

export const addonColors = [
  "Yellow",
  "Red",
  "Black",
  "White",
  "Green",
  "Blue",
  "Pink",
  "Purple"
];

export const initialOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const numberOptions = "0123456789".split("");
export const initialOrNumberOptions = [...initialOptions, ...numberOptions];

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
    name: "Custom Initial / Number Add-on",
    price: 2500,
    productType: "addon",
    selectionMode: "initial_color_combo",
    priceLabel: "IDR 2,500 / initial or number combination",
    description:
      "Optional initial or number add-on for your bracelet. Choose a letter A-Z or number 0-9, choose its color, then add it as a combination.",
    short:
      "Add-on letters A-Z and numbers 0-9 with color combination.",
    optionsLabel: "Initial / Number",
    colorLabel: "Initial / Number Color",
    notesLabel: "Selected Initial / Number Combinations",
    notesPlaceholder:
      "Your selected initials or numbers will appear here automatically. Example: A - Blue or 7 - Pink.",
    variants: initialOrNumberOptions,
    optionGroups: [
      {
        label: "Initial Options",
        options: initialOptions
      },
      {
        label: "Number Options",
        options: numberOptions
      }
    ],
    colorOptions: addonColors,
    requiresNotes: false,
    showNotes: true,
    quantityLabel: "Initial / Number Quantity",
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
    colorOptions: addonColors,
    requiresNotes: false,
    showNotes: true,
    quantityLabel: "Character Quantity",
    images: [
      "/bracelet-character.png"
    ]
  }
];
