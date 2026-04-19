import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export default function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  let baseStyles = "inline-flex items-center justify-center font-manrope transition-all duration-200 outline-none";
  
  if (variant === "primary") {
    // Primary: Uses Forest Green gradient. Text is on_primary. Roundedness is md.
    baseStyles += " px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-md text-label-lg font-bold hover:shadow-[0_0_32px_rgba(1,45,29,0.15)]";
  } else if (variant === "secondary") {
    // Secondary: No background. Primary text with title-sm weight.
    baseStyles += " px-4 py-2 bg-transparent text-primary text-title-sm font-bold hover:bg-surface-container-low rounded-md";
  } else if (variant === "tertiary") {
    // Tertiary: surface_container_high background with on_surface_variant text.
    baseStyles += " px-4 py-2 bg-surface-container-high text-on-surface-variant text-label-md font-medium hover:bg-surface-container rounded-md";
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
