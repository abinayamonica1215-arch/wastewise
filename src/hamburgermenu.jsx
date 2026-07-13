import { useState, useRef, useEffect } from "react";
import "./interactive.css";

const MENU_ITEMS = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "details", label: "My Details", icon: "🧾" },
  { key: "newAnalysis", label: "New Analysis", icon: "♻️" },
  { key: "centers", label: "Processing Centers", icon: "🏭" },
  { key: "history", label: "History & Analytics", icon: "📊" },
];

export default function HamburgerMenu({ activeView, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleItemClick(key) {
    setOpen(false);
    onNavigate(key);
  }

  function handleLogoutClick() {
    setOpen(false);
    onLogout();
  }

  return (
    <div className="ww-navbar" ref={wrapRef}>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className={`ww-hamburger-btn${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ww-hamburger-line" />
        <span className="ww-hamburger-line" />
        <span className="ww-hamburger-line" />
      </button>

      {open && (
        <nav className="ww-nav-dropdown" role="menu">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              role="menuitem"
              className={`ww-nav-item${activeView === item.key ? " ww-nav-item--active" : ""}`}
              onClick={() => handleItemClick(item.key)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button
            role="menuitem"
            className="ww-nav-item ww-nav-item--logout"
            onClick={handleLogoutClick}
          >
            <span aria-hidden="true">🚪</span>
            Logout
          </button>
        </nav>
      )}
    </div>
  );
}