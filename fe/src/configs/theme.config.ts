interface ColorConfig {
  background: string;
  foreground: string;
}

interface ThemeConfig {
  light: {
    background: string;
    foreground: string;
    card: ColorConfig;
    popover: ColorConfig;
    primary: ColorConfig;
    secondary: ColorConfig;
    muted: ColorConfig;
    accent: ColorConfig;
    destructive: ColorConfig;
    warning: ColorConfig;
    success: ColorConfig;
    info: ColorConfig;
    border: string;
    input: string;
    ring: string;
  };
  dark: {
    background: string;
    foreground: string;
    card: ColorConfig;
    popover: ColorConfig;
    primary: ColorConfig;
    secondary: ColorConfig;
    muted: ColorConfig;
    accent: ColorConfig;
    destructive: ColorConfig;
    warning: ColorConfig;
    success: ColorConfig;
    info: ColorConfig;
    border: string;
    input: string;
    ring: string;
  };
}

export const themeConfig: ThemeConfig = {
  light: {
    background: "#F4FBF9",
    foreground: "#0F172A",

    card: {
      background: "#FFFFFF",
      foreground: "#0F172A",
    },
    popover: {
      background: "#FFFFFF",
      foreground: "#0F172A",
    },
    primary: {
      background: "#00AF91",
      foreground: "#FFFFFF",
    },

    secondary: {
      background: "#E6F7F3",
      foreground: "#007A66",
    },

    muted: {
      background: "#F1F5F9",
      foreground: "rgba(15, 23, 42, 0.6)",
    },

    accent: {
      background: "#D1FAF3",
      foreground: "#007A66",
    },

    destructive: {
      background: "#DC2626",
      foreground: "#FFFFFF",
    },

    warning: {
      background: "#FACC15",
      foreground: "#854D0E",
    },
    success: {
      background: "#22C55E",
      foreground: "#14532D",
    },

    info: {
      background: "#0EA5E9",
      foreground: "#FFFFFF",
    },

    border: "rgba(0, 175, 145, 0.25)",
    input: "rgba(0, 175, 145, 0.25)",
    ring: "rgba(0, 175, 145, 0.4)",
  },
  dark: {
    background: "#1A1A1A",
    foreground: "#F5EAFF",
    card: {
      background: "#2A2A2A",
      foreground: "#F5EAFF",
    },
    popover: {
      background: "#2A2A2A",
      foreground: "#F5EAFF",
    },
    primary: {
      background: "#911DEC",
      foreground: "#F5EAFF",
    },
    secondary: {
      background: "#2A2A2A",
      foreground: "#F5EAFF",
    },
    muted: {
      background: "#2A2A2A",
      foreground: "rgba(245, 234, 255, 0.6)",
    },
    accent: {
      background: "#2A2A2A",
      foreground: "#F5EAFF",
    },
    destructive: {
      background: "#FA0C00",
      foreground: "#F5EAFF",
    },
    warning: {
      background: "#FECA13",
      foreground: "#FECA1322",
    },
    success: {
      background: "#28DE25",
      foreground: "#28DE2522",
    },
    info: {
      background: "#04B4FC",
      foreground: "#04B4FC22",
    },
    border: "rgba(245, 234, 255, 0.1)",
    input: "rgba(245, 234, 255, 0.15)",
    ring: "rgba(245, 234, 255, 0.3)",
  },
};
