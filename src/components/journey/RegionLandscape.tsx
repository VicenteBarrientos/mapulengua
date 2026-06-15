import type { LandscapeKind } from "@/lib/types";

type Props = {
  kind: LandscapeKind;
  className?: string;
};

export function RegionLandscape({ kind, className = "" }: Props) {
  switch (kind) {
    case "desert":
      return <Desert className={className} />;
    case "coast":
      return <Coast className={className} />;
    case "araucania":
      return <Araucania className={className} />;
    case "chiloé":
      return <Chiloe className={className} />;
    case "patagonia":
      return <Patagonia className={className} />;
    case "city":
      return <City className={className} />;
    case "wine":
      return <Wine className={className} />;
    case "lake":
      return <Lake className={className} />;
    case "volcano":
      return <Volcano className={className} />;
    case "fjord":
      return <Fjord className={className} />;
    default:
      return <Coast className={className} />;
  }
}

function Desert({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4a261" />
          <stop offset="100%" stopColor="#e9c46a" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#d-sky)" />
      <circle cx="320" cy="50" r="28" fill="#fff5e0" opacity="0.9" />
      {/* Dunes */}
      <path d="M0 140 Q100 110 200 135 T400 125 L400 200 L0 200 Z" fill="#d4a574" />
      <path d="M0 155 Q150 130 300 150 T400 145 L400 200 L0 200 Z" fill="#c4956a" />
      {/* Cactus / desert plant */}
      <path d="M60 155 L60 125 M52 135 L68 135" stroke="#588157" strokeWidth="3" fill="none" />
      {/* Geoglyph hint */}
      <circle cx="200" cy="150" r="12" fill="none" stroke="#a34a1e" strokeWidth="1.5" opacity="0.5" />
      <line x1="200" y1="138" x2="200" y2="162" stroke="#a34a1e" strokeWidth="1.5" opacity="0.5" />
      <line x1="188" y1="150" x2="212" y2="150" stroke="#a34a1e" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function Coast({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="130" fill="#89c2d9" />
      <rect y="130" width="400" height="70" fill="#caf0f8" />
      {/* Hills */}
      <path d="M0 130 L80 90 L160 120 L240 70 L320 110 L400 80 L400 200 L0 200 Z" fill="#e63946" opacity="0.35" />
      <path d="M0 145 L100 115 L200 140 L300 100 L400 130 L400 200 L0 200 Z" fill="#457b9d" />
      {/* Sea */}
      <path d="M0 160 Q50 155 100 160 T200 158 T300 162 T400 158 L400 200 L0 200 Z" fill="#0077b6" opacity="0.6" />
      {/* Bird */}
      <path d="M180 60 Q185 55 190 60 Q195 55 200 60" stroke="#1d3557" strokeWidth="2" fill="none" />
    </svg>
  );
}

function Araucania({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="200" fill="#a3b18a" />
      <path d="M0 120 L60 60 L120 100 L200 40 L280 90 L360 50 L400 80 L400 200 L0 200 Z" fill="#588157" />
      {/* Araucaria trees */}
      {[80, 160, 280, 340].map((x) => (
        <g key={x} transform={`translate(${x}, 130)`}>
          <polygon points="0,-35 12,0 -12,0" fill="#344e41" />
          <polygon points="0,-25 10,0 -10,0" fill="#3d5a40" />
          <rect x="-3" y="0" width="6" height="12" fill="#5c4030" />
        </g>
      ))}
      {/* Kultrun symbol */}
      <circle cx="200" cy="155" r="14" fill="none" stroke="#c8542a" strokeWidth="2" opacity="0.6" />
      <line x1="200" y1="141" x2="200" y2="169" stroke="#c8542a" strokeWidth="1.5" opacity="0.6" />
      <line x1="186" y1="155" x2="214" y2="155" stroke="#c8542a" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function Chiloe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="200" fill="#a8dadc" />
      <path d="M0 150 L400 140 L400 200 L0 200 Z" fill="#457b9d" />
      {/* Palafito */}
      <rect x="140" y="120" width="50" height="30" fill="#1d3557" />
      <rect x="135" y="150" width="8" height="25" fill="#5c4030" />
      <rect x="177" y="150" width="8" height="25" fill="#5c4030" />
      {/* Church dome hint */}
      <path d="M250 130 L265 100 L280 130 Z" fill="#e63946" opacity="0.7" />
      <rect x="248" y="130" width="34" height="25" fill="#f1faee" />
    </svg>
  );
}

function Patagonia({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="200" fill="#adb5bd" />
      <path d="M0 100 L100 40 L200 80 L300 20 L400 60 L400 200 L0 200 Z" fill="#6c757d" />
      <path d="M280 20 L290 45 L300 25 L310 50 L320 30 L330 55 L340 35 L350 60 L360 40 L370 65 L380 45 L390 70 L400 50 L400 200 L0 200 Z" fill="#495057" />
      <path d="M295 35 L300 20 L305 35 Z" fill="#f8f9fa" />
      <path d="M325 40 L332 22 L339 40 Z" fill="#f8f9fa" />
      <path d="M0 160 Q200 150 400 165 L400 200 L0 200 Z" fill="#48cae4" opacity="0.4" />
    </svg>
  );
}

function City({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="120" fill="#89c2d9" />
      <path d="M0 120 L400 100 L400 200 L0 200 Z" fill="#588157" opacity="0.5" />
      <path d="M280 30 L320 10 L360 35 L360 120 L280 120 Z" fill="#6c757d" opacity="0.35" />
      {[40, 90, 140, 190, 240, 290].map((x) => (
        <rect key={x} x={x} y={120 - (x % 60)} width={28} height={80 + (x % 40)} fill="#495057" rx="2" />
      ))}
      <rect x="170" y="70" width="60" height="50" fill="#c8542a" opacity="0.7" rx="2" />
    </svg>
  );
}

function Wine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="200" fill="#457b9d" />
      <path d="M0 130 Q100 110 200 125 T400 120 L400 200 L0 200 Z" fill="#588157" />
      {[60, 120, 180, 240, 300, 360].map((x) => (
        <ellipse key={x} cx={x} cy={128} rx="18" ry="8" fill="#344e41" />
      ))}
      <circle cx="320" cy="45" r="22" fill="#fff5e0" opacity="0.85" />
    </svg>
  );
}

function Lake({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="100" fill="#a8dadc" />
      <path d="M0 100 L80 80 L160 95 L240 75 L320 90 L400 85 L400 200 L0 200 Z" fill="#588157" />
      <path d="M0 140 Q200 125 400 135 L400 200 L0 200 Z" fill="#0077b6" opacity="0.55" />
      <ellipse cx="200" cy="155" rx="80" ry="12" fill="#48cae4" opacity="0.4" />
    </svg>
  );
}

function Volcano({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="200" fill="#adb5bd" />
      <path d="M0 150 L400 145 L400 200 L0 200 Z" fill="#588157" />
      <path d="M160 150 L200 40 L240 150 Z" fill="#495057" />
      <path d="M190 55 L200 35 L210 55 Z" fill="#f8f9fa" />
      <ellipse cx="200" cy="165" rx="50" ry="8" fill="#48cae4" opacity="0.5" />
    </svg>
  );
}

function Fjord({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="400" height="200" fill="#6c757d" />
      <path d="M0 80 L120 60 L200 90 L280 50 L400 70 L400 200 L0 200 Z" fill="#495057" />
      <path d="M180 90 L220 200 L160 200 Z" fill="#0077b6" opacity="0.65" />
      <path d="M0 160 Q200 145 400 158 L400 200 L0 200 Z" fill="#48cae4" opacity="0.35" />
    </svg>
  );
}
