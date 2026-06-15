export function MountainScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c5dce8" />
          <stop offset="100%" stopColor="#e8f0f4" />
        </linearGradient>
        <linearGradient id="peak-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4e4ec" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#sky)" />

      {/* Distant peaks */}
      <path
        d="M0 120 L80 60 L160 100 L240 40 L320 90 L400 50 L400 180 L0 180 Z"
        fill="#8eb4c4"
        opacity="0.5"
      />
      {/* Mid mountains */}
      <path
        d="M0 140 L60 90 L130 115 L200 70 L270 110 L340 80 L400 120 L400 180 L0 180 Z"
        fill="#6a9ab0"
        opacity="0.7"
      />
      {/* Foreground hills */}
      <path
        d="M0 155 L50 130 L120 150 L200 125 L280 148 L360 132 L400 150 L400 180 L0 180 Z"
        fill="#5a8a6a"
      />
      {/* Snow caps */}
      <path d="M230 70 L240 40 L250 70 Z" fill="url(#peak-snow)" />
      <path d="M70 60 L80 45 L90 60 Z" fill="url(#peak-snow)" opacity="0.9" />
      {/* Pine trees */}
      {[30, 55, 310, 340, 365].map((x) => (
        <g key={x} transform={`translate(${x}, 148)`}>
          <polygon points="0,-18 8,0 -8,0" fill="#2d5016" />
          <polygon points="0,-12 6,0 -6,0" fill="#3d6b22" />
          <rect x="-2" y="0" width="4" height="6" fill="#5c4030" />
        </g>
      ))}
    </svg>
  );
}
