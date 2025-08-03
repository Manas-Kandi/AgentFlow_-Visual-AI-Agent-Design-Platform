// VS Code-style form components for AgentFlow properties panels
import React from "react";
import {
  figmaPropertiesTheme as theme,
  themeHelpers,
} from "./propertiesPanelTheme";

// ...existing code from your message...

// VSCodeInput
export const VSCodeInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      width: "100%",
      background: theme.colors.backgroundSecondary,
      color: "#f3f3f3",
      border: `1px solid ${theme.colors.border}`,
      borderRadius: "6px",
      padding: "12px",
      fontFamily: "Menlo, monospace",
      fontSize: "15px",
      outline: "none",
      transition: "border-color 0.15s",
      ...style,
    }}
  />
);

// VSCodeSelect
interface VSCodeSelectOption {
  value: string;
  label: string;
}
interface VSCodeSelectProps {
  value: string;
  onValueChange: (v: string) => void;
  options: VSCodeSelectOption[];
  placeholder?: string;
  style?: React.CSSProperties;
}
export const VSCodeSelect: React.FC<VSCodeSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder,
  style,
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    style={{
      width: "100%",
      background: theme.colors.backgroundSecondary,
      color: "#f3f3f3",
      border: `1px solid ${theme.colors.border}`,
      borderRadius: "6px",
      padding: "12px",
      fontFamily: "Menlo, monospace",
      fontSize: "15px",
      outline: "none",
      transition: "border-color 0.15s",
      ...style,
    }}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// VSCodeButton
interface VSCodeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium";
}
export const VSCodeButton: React.FC<VSCodeButtonProps> = ({
  variant = "primary",
  size = "medium",
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  // Use theme helper for consistency
  const baseStyle = themeHelpers.getButtonStyle(
    variant === "danger" ? "secondary" : variant
  );
  // Override colors for danger variant using theme
  const variantStyle: React.CSSProperties =
    variant === "danger"
      ? {
          backgroundColor: theme.colors.error,
          border: `1px solid ${theme.colors.error}`,
          color: "white",
        }
      : {};
  // Size adjustments using theme tokens
  const sizeStyle: React.CSSProperties =
    size === "small"
      ? {
          height: theme.spacing.buttonHeight,
          fontSize: theme.typography.fontSize.xs,
          padding: `0 ${theme.spacing.sm}`,
        }
      : {};
  // Hover effects
  const hoverStyle: React.CSSProperties = isHovered
    ? {
        filter: "brightness(0.96)",
        boxShadow: theme.shadows.subtle,
      }
    : {};
  return (
    <button
      {...props}
      style={{
        ...baseStyle,
        ...variantStyle,
        ...sizeStyle,
        ...hoverStyle,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

// VSCodeSlider
interface VSCodeSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (v: number) => void;
  style?: React.CSSProperties;
}
export const VSCodeSlider: React.FC<VSCodeSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.sm,
      width: "100%",
      ...style,
    }}
  >
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      style={{ flex: 1 }}
    />
    <span
      style={{
        width: 48,
        textAlign: "right",
        fontFamily: "Menlo, monospace",
        fontSize: "13px",
        color: theme.colors.textPrimary,
      }}
    >
      {value}
    </span>
  </div>
);

// VSCodeTagInput
interface VSCodeTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}
export const VSCodeTagInput: React.FC<VSCodeTagInputProps> = ({
  tags,
  onChange,
  placeholder = "Add tag",
  style,
}) => {
  const [input, setInput] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (idx: number) => {
    const next = [...tags];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing.xs,
        background: theme.colors.backgroundSecondary,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "6px",
        padding: theme.spacing.xs,
        ...style,
      }}
    >
      {tags.map((tag, i) => (
        <span
          key={tag + i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: theme.colors.backgroundTertiary,
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: 13,
            fontFamily: "Menlo, monospace",
            color: theme.colors.textPrimary,
          }}
        >
          {tag}
          <button
            onClick={() => removeTag(i)}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.textSecondary,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          minWidth: 60,
          background: "transparent",
          border: "none",
          color: theme.colors.textPrimary,
          fontFamily: "Menlo, monospace",
          fontSize: "13px",
          outline: "none",
        }}
      />
    </div>
  );
};

// VSCodeColorPicker
interface VSCodeColorPickerProps {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}
export const VSCodeColorPicker: React.FC<VSCodeColorPickerProps> = ({
  value,
  onChange,
  style,
}) => (
  <input
    type="color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      height: 32,
      background: theme.colors.backgroundSecondary,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: "6px",
      padding: 0,
      ...style,
    }}
  />
);
