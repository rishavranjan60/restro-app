import React from "react";

const MenuIcon: React.FC<{ name: "bag" | "utensils"; size?: number }> = ({
  name,
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {name === "bag" ? (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M9 8V5a3 3 0 0 1 6 0v3" />
      </>
    ) : (
      <>
        <path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18M19 3c-3 2-4 6-4 9h4M19 3v18" />
      </>
    )}
  </svg>
);
export default MenuIcon;
