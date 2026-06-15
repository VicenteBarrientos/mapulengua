// Pudu — Chile's smallest deer, mascot of Mapulengua
// Chibi proportions: big head, small body · spread arms · asymmetric smirk

const P = {
  brown: "#A67C52",
  dark: "#4B2E1E",
  cream: "#F5E9D6",
  earPink: "#C98070",
  eye: "#1A0A00",
  white: "#FFFFFF",
  red: "#E24A2B",
  redDark: "#BF3820",
  gold: "#F2C94C",
  shadow: "#9A9A9A",
} as const;

type Props = {
  blinking: boolean;
  talkOpen: boolean;
  emotion: string;
};

function NiminBand({ x, y, w, count = 6 }: { x: number; y: number; w: number; count?: number }) {
  const step = w / count;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const cx = x + i * step + step / 2;
        return (
          <path
            key={i}
            d={`M${cx} ${y + 1} L${cx + 3} ${y + 5} L${cx} ${y + 9} L${cx - 3} ${y + 5} Z`}
            fill={P.cream}
            opacity="0.92"
          />
        );
      })}
    </>
  );
}

export function KumeSvgArt({ blinking, talkOpen, emotion }: Props) {
  const sad = emotion === "sad";
  const thinking = emotion === "thinking";
  const excited = emotion === "excited" || emotion === "celebrating";
  const proud = emotion === "proud";

  return (
    <svg
      viewBox="0 0 200 196"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="kume-svg h-full w-full overflow-visible"
      aria-hidden
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="191" rx="26" ry="4" fill={P.shadow} opacity="0.25" />

      {/* ── Antlers — small nubs ── */}
      <path
        d="M87 54 C86 48 83 43 84 36 M84 36 L81 31 M84 36 L87 32"
        stroke={P.dark} strokeWidth="3" strokeLinecap="round" fill="none"
      />
      <path
        d="M113 54 C114 48 117 43 116 36 M116 36 L119 31 M116 36 L113 32"
        stroke={P.dark} strokeWidth="3" strokeLinecap="round" fill="none"
      />

      {/* ── Ears ── */}
      <ellipse cx="66" cy="67" rx="16" ry="22" fill={P.brown} transform="rotate(-10 66 67)" />
      <ellipse cx="66" cy="70" rx="10" ry="15" fill={P.earPink} transform="rotate(-10 66 70)" />
      <ellipse cx="134" cy="67" rx="16" ry="22" fill={P.brown} transform="rotate(10 134 67)" />
      <ellipse cx="134" cy="70" rx="10" ry="15" fill={P.earPink} transform="rotate(10 134 70)" />

      {/* ── Arms — spread out, confident stance ── */}
      <g className={`kume-wing-l ${thinking ? "kume-wing-thinking-l" : ""}`}>
        <path
          d="M68 116 Q50 124 46 144 Q54 150 60 147 Q70 140 70 120 Q70 116 68 116 Z"
          fill={P.brown}
        />
        <ellipse cx="50" cy="148" rx="7" ry="5" fill={P.dark} />
      </g>
      <g className={`kume-wing-r ${excited ? "kume-wing-flap-r" : ""}`}>
        <path
          d="M132 116 Q150 124 154 144 Q146 150 140 147 Q130 140 130 120 Q130 116 132 116 Z"
          fill={P.brown}
        />
        <ellipse cx="150" cy="148" rx="7" ry="5" fill={P.dark} />
      </g>

      {/* ── Head ── */}
      <g
        className={`kume-head ${thinking ? "kume-head-thinking" : ""} ${sad ? "kume-head-sad" : ""}`}
      >
        <circle cx="100" cy="74" r="40" fill={P.brown} />
        {/* Crown shading */}
        <ellipse cx="100" cy="53" rx="32" ry="20" fill={P.dark} opacity="0.20" />

        {/* Headband */}
        <rect x="62" y="48" width="76" height="13" rx="4" fill={P.red} />
        <NiminBand x={64} y={49} w={72} count={6} />

        {/* Muzzle */}
        <ellipse cx="100" cy="91" rx="19" ry="13" fill={P.cream} />

        {/* ── Eyes ── */}
        <g className={`kume-eyes ${proud ? "kume-eyes-proud" : ""} ${sad ? "kume-eyes-sad" : ""}`}>
          {!blinking && !proud && !sad && (
            <>
              <circle cx="83" cy="72" r="14" fill={P.eye} />
              <circle cx="117" cy="72" r="14" fill={P.eye} />
              {/* Highlight top-right */}
              <circle cx="91" cy="65" r="4.5" fill={P.white} />
              <circle cx="125" cy="65" r="4.5" fill={P.white} />
              {/* Secondary glint */}
              <circle cx="80" cy="78" r="2" fill={P.white} opacity="0.45" />
              <circle cx="114" cy="78" r="2" fill={P.white} opacity="0.45" />
            </>
          )}
          {blinking && (
            <>
              <path d="M69 72 Q83 63 97 72" stroke={P.dark} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M103 72 Q117 63 131 72" stroke={P.dark} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          )}
          {proud && !blinking && (
            <>
              <path d="M69 70 Q83 61 97 70" stroke={P.eye} strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M103 70 Q117 61 131 70" stroke={P.eye} strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          )}
          {sad && !blinking && (
            <>
              <path d="M69 68 Q83 77 97 68" stroke={P.eye} strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M103 68 Q117 77 131 68" stroke={P.eye} strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* ── Brows — left flat, right slightly raised = cocky asymmetry ── */}
        <path d="M70 55 Q83 51 95 54" stroke={P.dark} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M105 52 Q118 49 130 54" stroke={P.dark} strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <ellipse cx="100" cy="89" rx="5" ry="3.5" fill={P.eye} />

        {/* Mouth — smirk: right corner slightly higher */}
        {!sad ? (
          <path
            d={talkOpen
              ? "M91 97 Q100 104 110 96"
              : "M91 97 Q101 102 110 97"}
            stroke={P.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
        ) : (
          <path d="M93 100 Q100 95 107 100" stroke={P.dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
      </g>

      {/* ── Body — compact rounded-rect, much smaller than head ── */}
      <rect x="72" y="124" width="56" height="38" rx="14" fill={P.brown} className="kume-game-body" />
      {/* Top shading */}
      <rect x="74" y="124" width="52" height="16" rx="12" fill={P.dark} opacity="0.15" />

      {/* Tiny pudu tail — white puff at right side */}
      <ellipse cx="129" cy="144" rx="7" ry="6" fill={P.cream} opacity="0.88" transform="rotate(-20 129 144)" />

      {/* Cream belly */}
      <ellipse cx="99" cy="148" rx="16" ry="13" fill={P.cream} />

      {/* Bandana/bib */}
      <path d="M70 112 Q100 106 130 112 L126 130 Q100 136 74 130 Z" fill={P.red} />

      {/* Kultrun medallion */}
      <circle cx="100" cy="120" r="10" fill={P.gold} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={100 + Math.cos(rad) * 2.8}
            y1={120 + Math.sin(rad) * 2.8}
            x2={100 + Math.cos(rad) * 8.6}
            y2={120 + Math.sin(rad) * 8.6}
            stroke={P.redDark}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="100" cy="120" r="2.8" fill={P.redDark} />

      {/* White spots */}
      <circle cx="116" cy="148" r="4" fill={P.cream} opacity="0.82" />
      <circle cx="78" cy="150" r="3.5" fill={P.cream} opacity="0.72" />

      {/* Legs — short & compact */}
      <rect x="84" y="160" width="11" height="20" rx="5" fill={P.dark} />
      <rect x="105" y="160" width="11" height="20" rx="5" fill={P.dark} />
      {/* Hooves */}
      <ellipse cx="89" cy="180" rx="8" ry="4" fill="#2A1008" />
      <ellipse cx="110" cy="180" rx="8" ry="4" fill="#2A1008" />

      {/* Sparkles (excited/celebrating) */}
      {excited && (
        <>
          <circle cx="160" cy="36" r="5" fill={P.gold} className="kume-sparkle kume-sparkle-a" />
          <circle cx="36" cy="42" r="4" fill={P.gold} className="kume-sparkle kume-sparkle-b" />
          <path d="M155 30 L158 40 L161 30 L158 34 Z" fill={P.gold} className="kume-sparkle kume-sparkle-a" opacity="0.8" />
          <path d="M31 36 L34 46 L37 36 L34 40 Z" fill={P.gold} className="kume-sparkle kume-sparkle-b" opacity="0.7" />
        </>
      )}
    </svg>
  );
}
