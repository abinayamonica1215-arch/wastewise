import "./interactive.css";

export default function RecycleHero() {
  return (
    <div className="ww-recycle-hero-wrap" aria-hidden="true">
      <div className="ww-recycle-hero-ring" />
      <svg
        className="ww-recycle-hero-icon"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wwRecycleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22a35a" />
            <stop offset="100%" stopColor="#b6ff3c" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#wwRecycleGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 20 L14 50 L26 57" transform="rotate(0 50 50)" />
          <path d="M32 20 L14 50 L26 57" transform="rotate(120 50 50)" />
          <path d="M32 20 L14 50 L26 57" transform="rotate(240 50 50)" />
        </g>
        <g fill="url(#wwRecycleGradient)">
          <path d="M50 8 L60 28 L40 28 Z" />
          <path d="M50 8 L60 28 L40 28 Z" transform="rotate(120 50 50)" />
          <path d="M50 8 L60 28 L40 28 Z" transform="rotate(240 50 50)" />
        </g>
        <circle cx="50" cy="50" r="8" fill="#0f2e1d" />
      </svg>
    </div>
  );
}