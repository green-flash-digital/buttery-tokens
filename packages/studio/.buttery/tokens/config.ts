export const config = {
  runtime: {
    namespace: "playground",
    prefix: "playground",
    strict: true,
    suppressStrictWarnings: false,
  },
  sizeAndSpace: {
    baseFontSize: 16,
    baselineGrid: 4,
    size: { variants: { dense: 24, normal: 32, big: 44 } },
    space: { mode: "auto", variants: 11 },
  },
  font: {
    source: "manual",
    families: {
      Poppins: {
        fallback:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        styles: [
          "bold-700",
          "semiBold-600",
          "medium-500",
          "regular-400",
          "light-300",
        ],
      },
      Inter: {
        fallback:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        styles: [
          "bold-700",
          "semiBold-600",
          "medium-500",
          "regular-400",
          "light-300",
        ],
      },
      Mulish: {
        fallback:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        styles: [
          "bold-700",
          "semiBold-600",
          "medium-500",
          "regular-400",
          "light-300",
        ],
      },
      Consolas: {
        fallback:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        styles: [
          "bold-700",
          "semiBold-600",
          "medium-500",
          "regular-400",
          "light-300",
        ],
      },
    },
    variants: {
      logo: {
        family: "Poppins",
        weight: "regular-400",
        size: 16,
        lineHeight: 1.3,
      },
      heading: {
        family: "Inter",
        weight: "regular-400",
        size: 16,
        lineHeight: 1.3,
      },
      body: {
        family: "Mulish",
        weight: "regular-400",
        size: 16,
        lineHeight: 1.3,
      },
      code: {
        family: "Consolas",
        weight: "regular-400",
        size: 16,
        lineHeight: 1.3,
      },
    },
  },
  response: { breakpoints: { phone: 375, tablet: 768, desktop: 1280 } },
  color: {
    brand: {
      type: "fluorescent",
      colors: {
        primary: { hue: 47, variants: 10 },
        secondary: { hue: 170, variants: 10 },
        warning: { hue: 60, variants: 6 },
        danger: { hue: 359, variants: 4 },
        success: { hue: 131, variants: 10 },
      },
      saturation: 82,
      brightness: 90,
    },
    neutral: {
      background: "#fff",
      surface: "#fff",
      neutral: {
        hex: "#030305",
        variants: { dark: "#030304", light: "#030306" },
      },
    },
  },
  custom: {
    "layout-header-height": {
      type: "rem",
      value: 100,
      description:
        "The height of the header. Used to reference the header height to calculate sticky values",
    },
    "layout-max-width": {
      type: "rem",
      value: 1600,
      description: "The max width of the application content area",
    },
    "layout-gutters": {
      type: "rem",
      value: 32,
      description: "The padding for each of the layouts",
    },
    "layout-section-title-height": {
      type: "rem",
      value: 72,
      description: "The height of the title for each of the section layout",
    },
    "modal-gutters": {
      type: "rem",
      value: 32,
      description:
        "The padding for any dialogs to be used in the header, body and footer elements",
    },
  },
};
