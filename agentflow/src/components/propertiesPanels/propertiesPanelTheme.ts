// This file is the single source of truth for all UI rules for properties panels.
// Do not use Tailwind, global CSS, or theme.ts for these components.

// Figma-inspired theme that maps design tokens to global CSS variables defined in
// `src/app/globals.css`. All properties panels should consume values from this
// theme so visual styling stays consistent.

export const figmaPropertiesTheme = {
  colors: {
    background: "hsl(var(--color-background))",
    backgroundSecondary: "hsl(var(--color-secondary))",
    backgroundTertiary: "hsl(var(--color-secondary))",
    border: "hsl(var(--color-border))",
    borderLight: "hsl(var(--color-border))",
    borderActive: "hsl(var(--color-ring))",
    textPrimary: "hsl(var(--color-foreground))",
    textSecondary: "hsl(var(--color-muted-foreground))",
    textMuted: "hsl(var(--color-muted-foreground))",
    textAccent: "hsl(var(--color-accent))",
    success: "#89d185",
    warning: "#ffb62c",
    error: "#f85149",
    info: "#58a6ff",
    buttonPrimary: "hsl(var(--color-accent))",
    buttonSecondary: "hsl(var(--color-secondary))",
    buttonHover: "hsl(var(--color-accent))",
    codeBackground: "#0d1117",
    tagBackground: "hsl(var(--color-secondary))",
    accentGlow: "rgba(10, 132, 255, 0.3)",
  },
  spacing: {
    xs: "var(--spacing-1)",
    sm: "var(--spacing-2)",
    md: "var(--spacing-3)",
    lg: "var(--spacing-4)",
    xl: "var(--spacing-5)",
    xxl: "var(--spacing-6)",
    sectionPadding: "var(--spacing-3)",
    fieldGap: "calc(var(--spacing-2) * 0.75)",
    inputPadding: "calc(var(--spacing-2) * 0.75) var(--spacing-2)",
    labelMargin: "var(--spacing-1)",
    panelPadding: "0px",
    headerHeight: "var(--spacing-8)",
    inputHeight: "28px",
    buttonHeight: "28px",
  },
  typography: {
    fontFamily: "var(--font-sans)",
    fontMono: "var(--font-mono)",
    fontSize: {
      xs: "var(--text-xs)",
      sm: "var(--text-sm)",
      base: "var(--text-base)",
      lg: "var(--text-lg)",
      xl: "var(--text-xl)",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  borderRadius: {
    none: "0px",
    xs: "var(--radius-sm)",
    sm: "var(--radius)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
  },
  shadows: {
    none: "none",
    subtle: "0 1px 2px rgba(0, 0, 0, 0.1)",
    medium: "0 2px 8px rgba(0, 0, 0, 0.15)",
    strong: "0 4px 16px rgba(0, 0, 0, 0.25)",
    glow: "0 0 0 2px rgba(10, 132, 255, 0.3)",
  },
  animation: {
    fast: "0.15s ease-out",
    medium: "0.25s ease-out",
    slow: "0.35s ease-out",
  },
  components: {
    panel: {
      width: "280px",
      minWidth: "260px",
      maxWidth: "300px",
    },
    section: {
      headerHeight: "32px",
      borderWidth: "1px",
      collapsedHeight: "32px",
    },
    input: {
      height: "28px",
      borderWidth: "1px",
      focusRingWidth: "2px",
    },
    button: {
      height: "28px",
      paddingX: "var(--spacing-2)",
      borderWidth: "1px",
    },
    dropdown: {
      itemHeight: "28px",
      maxHeight: "200px",
    },
  },
  states: {
    default: {
      background: "hsl(var(--color-secondary))",
      border: "hsl(var(--color-border))",
      text: "hsl(var(--color-foreground))",
    },
    hover: {
      background: "hsl(var(--color-border))",
      border: "hsl(var(--color-border))",
      text: "hsl(var(--color-foreground))",
    },
    focus: {
      background: "hsl(var(--color-secondary))",
      border: "hsl(var(--color-ring))",
      text: "hsl(var(--color-foreground))",
      boxShadow: "0 0 0 2px rgba(10, 132, 255, 0.3)",
    },
    active: {
      background: "hsl(var(--color-background))",
      border: "hsl(var(--color-ring))",
      text: "hsl(var(--color-foreground))",
    },
    disabled: {
      background: "hsl(var(--color-secondary))",
      border: "hsl(var(--color-border))",
      text: "hsl(var(--color-muted-foreground))",
    },
  },
} as const;

// Type definitions for better TypeScript support
export type FigmaTheme = typeof figmaPropertiesTheme;
export type ThemeColors = FigmaTheme["colors"];
export type ThemeSpacing = FigmaTheme["spacing"];
export type ThemeTypography = FigmaTheme["typography"];

// Helper functions for common styling patterns
export const themeHelpers = {
  // Get consistent input styling
  getInputStyle: (
    state: "default" | "hover" | "focus" | "error" = "default"
  ): React.CSSProperties => ({
    fontFamily: figmaPropertiesTheme.typography.fontFamily,
    fontSize: figmaPropertiesTheme.typography.fontSize.base,
    fontWeight: figmaPropertiesTheme.typography.fontWeight.normal,
    lineHeight: figmaPropertiesTheme.typography.lineHeight.normal,
    height: figmaPropertiesTheme.spacing.inputHeight,
    padding: figmaPropertiesTheme.spacing.inputPadding,
    borderRadius: figmaPropertiesTheme.borderRadius.sm,
    border: `1px solid ${
      state === "error"
        ? figmaPropertiesTheme.colors.error
        : state === "focus"
        ? figmaPropertiesTheme.colors.borderActive
        : figmaPropertiesTheme.colors.border
    }`,
    backgroundColor: figmaPropertiesTheme.colors.backgroundTertiary,
    color: figmaPropertiesTheme.colors.textPrimary,
    outline: "none",
    transition: `all ${figmaPropertiesTheme.animation.fast}`,
    ...(state === "focus" && {
      boxShadow: figmaPropertiesTheme.shadows.glow,
    }),
  }),
  // Get consistent button styling
  getButtonStyle: (
    variant: "primary" | "secondary" = "secondary"
  ): React.CSSProperties => ({
    fontFamily: figmaPropertiesTheme.typography.fontFamily,
    fontSize: figmaPropertiesTheme.typography.fontSize.base,
    fontWeight: figmaPropertiesTheme.typography.fontWeight.medium,
    height: figmaPropertiesTheme.spacing.buttonHeight,
    padding: `0 ${figmaPropertiesTheme.spacing.md}`,
    borderRadius: figmaPropertiesTheme.borderRadius.sm,
    border: `1px solid ${
      variant === "primary"
        ? figmaPropertiesTheme.colors.buttonPrimary
        : figmaPropertiesTheme.colors.border
    }`,
    backgroundColor:
      variant === "primary"
        ? figmaPropertiesTheme.colors.buttonPrimary
        : figmaPropertiesTheme.colors.buttonSecondary,
    color: figmaPropertiesTheme.colors.textPrimary,
    cursor: "pointer",
    outline: "none",
    transition: `all ${figmaPropertiesTheme.animation.fast}`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: figmaPropertiesTheme.spacing.sm,
  }),
  // Get section header styling
  getSectionHeaderStyle: (): React.CSSProperties => ({
    fontFamily: figmaPropertiesTheme.typography.fontFamily,
    fontSize: figmaPropertiesTheme.typography.fontSize.base,
    fontWeight: figmaPropertiesTheme.typography.fontWeight.semibold,
    lineHeight: figmaPropertiesTheme.typography.lineHeight.tight,
    color: figmaPropertiesTheme.colors.textPrimary,
    height: figmaPropertiesTheme.spacing.headerHeight,
    padding: `0 ${figmaPropertiesTheme.spacing.md}`,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: figmaPropertiesTheme.spacing.sm,
    borderBottom: `1px solid ${figmaPropertiesTheme.colors.border}`,
    backgroundColor: figmaPropertiesTheme.colors.backgroundSecondary,
    cursor: "pointer",
    transition: `all ${figmaPropertiesTheme.animation.fast}`,
  }),
  // Get label styling
  getLabelStyle: (): React.CSSProperties => ({
    fontFamily: figmaPropertiesTheme.typography.fontFamily,
    fontSize: figmaPropertiesTheme.typography.fontSize.sm,
    fontWeight: figmaPropertiesTheme.typography.fontWeight.normal,
    lineHeight: figmaPropertiesTheme.typography.lineHeight.normal,
    color: figmaPropertiesTheme.colors.textSecondary,
    marginBottom: figmaPropertiesTheme.spacing.labelMargin,
    display: "block",
  }),
};

