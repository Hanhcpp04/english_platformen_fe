import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center gap-2 text-sm mb-4 font-body"
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
      >
        <Home size={16} />
        Home
      </Link>
      {items.map((rawItem, idx) => {
        // support both string and object items
        const isLast = idx === items.length - 1;
        const label = typeof rawItem === "string" ? rawItem : rawItem.label;
        const link =
          typeof rawItem === "object" && rawItem.link ? rawItem.link : null;

        return (
          <React.Fragment key={idx}>
            <ChevronRight size={16} className="text-gray-400" />
            {isLast ? (
              <span className="text-dark-primary font-medium truncate max-w-md">
                {label.length > 50 ? label.substring(0, 50) + "..." : label}
              </span>
            ) : link ? (
              <Link
                to={link}
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                {label}
              </Link>
            ) : (
              // if no link provided, allow going back to previous page
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label={`Go back to previous page for ${label}`}
              >
                {label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
