import { ButtonHTMLAttributes, HtmlHTMLAttributes } from "react";

type ButtonProps = {
  children: React.ReactNode;
  width?: "auto" | "full";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "none" | "error";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  width = "auto",
  size = "md",
  color = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${color !== "none" && `btn-${color}`} btn-${size} w-${width}`}
      {...props}
    >
      {children}
    </button>
  );
}
