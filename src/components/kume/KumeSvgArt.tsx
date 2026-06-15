import { KUME_COLORS as C } from "./tokens";

type Props = {
  blinking: boolean;
  talkOpen: boolean;
  emotion: string;
};

/** Zigzag ñimin trim — white diamonds on terracotta */
function NiminTrim({ x, y, w, count = 6 }: { x: number; y: number; w: number; count?: number }) {
  const step = w / count;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const cx = x + i * step + step / 2;
        return (
          <g key={i}>
            <path
              d={`M${cx - step * 0.22} ${y + 4} L${cx} ${y} L${cx + step * 0.22} ${y + 4} L${cx} ${y + 8} Z`}
              fill={C.ponchoBorder}
            />
            <path
              d={`M${cx - step * 0.1} ${y + 4} L${cx} ${y + 2} L${cx + step * 0.1} ${y + 4} L${cx} ${y + 6} Z`}
              fill={C.ponchoPattern}
            />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Game Küme — flat vector matched to kume-game-reference.png
 * Two legs, big eyes, raised wings, terracotta poncho, headband, cream ruff.
 */
export function KumeSvgArt({ blinking, talkOpen, emotion }: Props) {
  const sad = emotion === "sad";
  const thinking = emotion === "thinking";
  const excited = emotion === "excited" || emotion === "celebrating";
  const proud = emotion === "proud";
  const beakOpen =
    talkOpen || excited || emotion === "happy" || emotion === "celebrating";

  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="kume-svg h-full w-full overflow-visible"
      aria-hidden
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="232" rx="36" ry="5" fill={C.shadow} opacity="0.35" />

      {/* ── Raised wings (behind body) ── */}
      <g className={`kume-wing-l ${thinking ? "kume-wing-thinking-l" : ""}`}>
        <path d="M48 118 L26 50 L40 44 L58 68 L72 108 Z" fill={C.feather} />
        <path d="M44 108 L32 68 L52 82 L62 106 Z" fill={C.neckRuff} />
      </g>
      <g className={`kume-wing-r ${excited ? "kume-wing-flap-r" : ""}`}>
        <path d="M152 118 L174 50 L160 44 L142 68 L128 108 Z" fill={C.feather} />
        <path d="M156 108 L168 68 L148 82 L138 106 Z" fill={C.neckRuff} />
      </g>

      {/* ── Lower body ── */}
      <ellipse cx="100" cy="168" rx="38" ry="34" fill={C.feather} className="kume-game-body" />

      {/* ── Two legs + flat feet ── */}
      <g className="kume-legs">
        <rect x="86" y="188" width="8" height="28" rx="2" fill={C.beak} />
        <rect x="106" y="188" width="8" height="28" rx="2" fill={C.beak} />
        <path d="M80 214 L98 214 L94 224 L82 224 Z" fill={C.talon} />
        <path d="M102 214 L120 214 L118 224 L104 224 Z" fill={C.talon} />
      </g>

      {/* ── Poncho ── */}
      <g className="kume-poncho">
        <path d="M54 128 L100 112 L146 128 L140 182 L100 192 L60 182 Z" fill={C.poncho} />
        {/* Gold wheel emblem */}
        <circle cx="100" cy="152" r="14" fill={C.medallion} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={100 + Math.cos(rad) * 3}
              y1={152 + Math.sin(rad) * 3}
              x2={100 + Math.cos(rad) * 12}
              y2={152 + Math.sin(rad) * 12}
              stroke={C.ponchoDark}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="100" cy="152" r="3" fill={C.ponchoDark} />
        <NiminTrim x={58} y={176} w={84} count={7} />
      </g>

      {/* ── Cream neck ruff ── */}
      <ellipse cx="100" cy="118" rx="36" ry="14" fill={C.neckRuff} />
      <ellipse cx="100" cy="115" rx="30" ry="10" fill={C.neckRuffLight} />

      {/* ── Head ── */}
      <g
        className={`kume-head ${sad ? "kume-head-sad" : ""} ${thinking ? "kume-head-thinking" : ""}`}
      >
        <circle cx="100" cy="68" r="40" fill={C.feather} />

        {/* Trarilonko headband */}
        <rect x="62" y="38" width="76" height="14" rx="2" fill={C.poncho} />
        <NiminTrim x={64} y={40} w={72} count={6} />
        {/* Crown feathers */}
        <path d="M128 36 L134 24 L138 38 Z" fill={C.feather} />
        <path d="M136 28 L142 22 L144 34 Z" fill={C.neckRuff} />
        <path d="M136 28 L142 22 L140 30 Z" fill={C.feather} opacity="0.5" />

        {/* Big dark eyes with shiny highlights (reference style) */}
        <g className={`kume-eyes ${proud ? "kume-eyes-proud" : ""} ${sad ? "kume-eyes-sad" : ""}`}>
          {!blinking && !proud && !sad && (
            <>
              <circle cx="82" cy="70" r="14" fill={C.eyeBrown} />
              <circle cx="118" cy="70" r="14" fill={C.eyeBrown} />
              <circle cx="86" cy="66" r="4" fill={C.eyeHighlight} />
              <circle cx="122" cy="66" r="4" fill={C.eyeHighlight} />
              <circle cx="79" cy="73" r="2" fill={C.eyeHighlight} />
              <circle cx="115" cy="73" r="2" fill={C.eyeHighlight} />
            </>
          )}
          {blinking && (
            <>
              <path d="M68 70 H96" stroke={C.featherSoft} strokeWidth="5" strokeLinecap="round" />
              <path d="M104 70 H132" stroke={C.featherSoft} strokeWidth="5" strokeLinecap="round" />
            </>
          )}
          {proud && !blinking && (
            <>
              <path d="M69 68 Q82 60 95 68" stroke={C.feather} strokeWidth="3.5" fill="none" />
              <path d="M105 68 Q118 60 131 68" stroke={C.feather} strokeWidth="3.5" fill="none" />
            </>
          )}
          {sad && !blinking && (
            <>
              <path d="M70 66 Q82 74 94 66" stroke={C.feather} strokeWidth="3" fill="none" />
              <path d="M106 66 Q118 74 130 66" stroke={C.feather} strokeWidth="3" fill="none" />
            </>
          )}
        </g>

        {/* Simple open beak + tongue */}
        <g className="kume-beak" transform="translate(100, 86)">
          <path d="M-12 -2 L0 -10 L12 -2 L0 2 Z" fill={C.beak} className="kume-beak-upper" />
          <path
            d="M-10 2 L0 10 L10 2 Z"
            fill={beakOpen ? C.beak : C.beakDark}
            className={`kume-beak-lower ${beakOpen ? "kume-beak-open" : ""} ${talkOpen ? "kume-beak-talking" : ""}`}
          />
          {beakOpen && (
            <ellipse cx="0" cy="5" rx="4" ry="2.5" fill={C.tongue} className="kume-tongue" />
          )}
        </g>
      </g>

      {excited && (
        <>
          <circle cx="158" cy="36" r="3" fill={C.sparkle} className="kume-sparkle kume-sparkle-a" />
          <circle cx="42" cy="40" r="2.5" fill={C.sparkle} className="kume-sparkle kume-sparkle-b" />
        </>
      )}
    </svg>
  );
}
