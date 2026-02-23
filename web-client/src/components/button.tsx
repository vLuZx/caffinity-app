import type React from "react";
import "../styles/button.css";
import { useNavigate } from "@tanstack/react-router";

type ButtonProps = {
  children?: React.ReactNode;

  textSize?: "main" | "small" | "large";
  variant?: "solid" | "text-only" | "outline";
  background?: string;
  foreground?: string;
  stretch?: boolean;
  to?: string;
  className?: string;
  type?: "button" | "submit" | "reset";

  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  isDisabled?: boolean;
};

export default function Button({
  children = <p>Click me</p>,
  textSize = "main",
  variant = "solid",
  background = "var(--primary-accent)",
  foreground = "#ffffff",
  stretch = false,
  to,
  className = "",
  type = "button",
  onClick,
  isDisabled,
}: ButtonProps) {
  const navigate = useNavigate();

  const baseVariantClass = `btn-${variant}`;

  const finalClassName = [
    baseVariantClass,
    stretch ? "w-full" : "",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && to) {
      navigate({ to });
    }
  };

  return (
    <button
      type={type}
      className={finalClassName}
      style={{
        ["--btn-bg" as any]: background,
        ["--btn-fg" as any]: foreground,
        ["--btn-text-size" as any]: `var(--text-size-${textSize})`,
      }}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}