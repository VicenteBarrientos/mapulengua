import { KUME_COLORS as C } from "./tokens";

type Props = {
  blinking: boolean;
  talkOpen: boolean;
  emotion: string;
};

/** Mapuche ñimin diamond pattern for headband / poncho trim */
function NiminPattern({
  x,
  y,
  w,
  h,
  stroke = C.ponchoBorder,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  stroke?: string;
}) {
  const step = w / 5;
  return (
    <g stroke={stroke} strokeWidth="1.4" fill="none">
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={i}
          d={`M${x + i * step} ${y + h / 2} L${x + i * step + step / 2} ${y} L${x + i * step + step} ${y + h / 2} L${x + i * step + step / 2} ${y + h} Z`}
        />
      ))}
    </g>
  );
}

/**
 * Game Küme — simplified vector for small interactive reactions.
 * Visually aligned with the official PNG: big eyes, big beak, ruff, poncho, medallion.
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
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="kume-svg h-full w-full overflow-visible"
      aria-hidden
    >
      {/* Back wing */}
      <g className={`kume-wing-back ${thinking ? "kume-wing-thinking" : ""}`}>
        <path
          d="M34 142 C18 118 12 92 22 72 C32 54 48 64 56 82 C62 98 58 118 52 134 C46 146 40 148 34 142Z"
          fill={C.feather}
        />
        <path
          d="M26 128 C20 112 18 96 24 84 C30 72 40 78 46 92 C50 104 46 120 40 128Z"
          fill={C.wingTip}
        />
      </g>

      {/* Body */}
      <g className="kume-torso">
        <ellipse cx="100" cy="178" rx="44" ry="50" fill={C.feather} />
        <ellipse cx="100" cy="172" rx="36" ry="38" fill={C.featherSoft} opacity="0.35" />
        {/* Legs */}
        <path d="M76 218 L70 252 L84 252 L88 222Z" fill={C.beak} />
        <path d="M100 222 L96 254 L112 254 L114 224Z" fill={C.beak} />
        <path d="M124 218 L120 252 L134 252 L128 222Z" fill={C.beak} />
        <path d="M70 252 L66 258 L88 258 L84 252Z" fill={C.talon} />
        <path d="M96 254 L92 260 L112 260 L112 254Z" fill={C.talon} />
        <path d="M120 252 L116 258 L138 258 L134 252Z" fill={C.talon} />
      </g>

      {/* Poncho — terracotta with ñimin border */}
      <g className="kume-poncho">
        <path
          d="M52 138 L100 122 L148 138 L142 192 L100 204 L58 192 Z"
          fill={C.poncho}
        />
        <path
          d="M58 138 L100 126 L142 138"
          stroke={C.ponchoDark}
          strokeWidth="2"
          fill="none"
        />
        <NiminPattern x={58} y={178} w={84} h={10} stroke={C.ponchoBorder} />
        <NiminPattern x={58} y={188} w={84} h={8} stroke={C.ponchoPattern} />
        {/* Medallion / kultrun */}
        <circle cx="100" cy="158" r="16" fill={C.medallion} />
        <circle cx="100" cy="158" r="12" fill={C.medallionInner} opacity="0.55" />
        <circle cx="100" cy="158" r="8" fill="none" stroke={C.ponchoDark} strokeWidth="1.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={100 + Math.cos(rad) * 4}
              y1={158 + Math.sin(rad) * 4}
              x2={100 + Math.cos(rad) * 11}
              y2={158 + Math.sin(rad) * 11}
              stroke={C.ponchoDark}
              strokeWidth="1.2"
            />
          );
        })}
      </g>

      {/* Cream neck ruff — prominent */}
      <ellipse cx="100" cy="124" rx="40" ry="16" fill={C.neckRuff} />
      <ellipse cx="100" cy="120" rx="34" ry="12" fill={C.neckRuffLight} />
      <ellipse cx="88" cy="126" rx="8" ry="5" fill={C.neckRuffLight} opacity="0.6" />
      <ellipse cx="112" cy="126" rx="8" ry="5" fill={C.neckRuffLight} opacity="0.6" />

      {/* Head */}
      <g
        className={`kume-head ${sad ? "kume-head-sad" : ""} ${thinking ? "kume-head-thinking" : ""}`}
      >
        <ellipse cx="100" cy="72" rx="42" ry="40" fill={C.feather} />
        {/* Cheek fluff */}
        <ellipse cx="68" cy="78" rx="10" ry="8" fill={C.featherSoft} />
        <ellipse cx="132" cy="78" rx="10" ry="8" fill={C.featherSoft} />

        {/* Trarilonko headband */}
        <rect x="60" y="44" width="80" height="14" rx="3" fill={C.trarilonko} />
        <NiminPattern x={62} y={46} w={76} h={10} stroke={C.ponchoBorder} />
        <NiminPattern x={62} y={48} w={76} h={6} stroke={C.poncho} />
        {/* Crown feathers */}
        <path d="M124 42 L130 32 L134 44" fill={C.feather} />
        <path d="M132 34 L138 28 L140 38" fill={C.neckRuff} />

        {/* Eyes — large & expressive */}
        <g className={`kume-eyes ${proud ? "kume-eyes-proud" : ""} ${sad ? "kume-eyes-sad" : ""}`}>
          <ellipse cx="82" cy="74" rx="14" ry="15" fill={C.eyeWhite} />
          <ellipse cx="118" cy="74" rx="14" ry="15" fill={C.eyeWhite} />
          <circle cx="84" cy="76" r="8" fill={C.eyeBrown} />
          <circle cx="120" cy="76" r="8" fill={C.eyeBrown} />
          <circle cx="86" cy="73" r="3.5" fill={C.eyeHighlight} />
          <circle cx="122" cy="73" r="3.5" fill={C.eyeHighlight} />
          <circle cx="81" cy="78" r="1.5" fill={C.eyeHighlight} opacity="0.7" />
          <circle cx="117" cy="78" r="1.5" fill={C.eyeHighlight} opacity="0.7" />
          <ellipse cx="82" cy="74" rx="15" ry={blinking ? 15 : 0} fill={C.feather} />
          <ellipse cx="118" cy="74" rx="15" ry={blinking ? 15 : 0} fill={C.feather} />
          {proud && (
            <>
              <path d="M68 72 Q82 64 96 72" stroke={C.feather} strokeWidth="3.5" fill="none" />
              <path d="M104 72 Q118 64 132 72" stroke={C.feather} strokeWidth="3.5" fill="none" />
            </>
          )}
          {sad && (
            <>
              <path d="M70 70 Q82 78 94 70" stroke={C.feather} strokeWidth="3" fill="none" />
              <path d="M106 70 Q118 78 130 70" stroke={C.feather} strokeWidth="3" fill="none" />
            </>
          )}
        </g>

        {/* Beak — large hooked */}
        <g className="kume-beak" transform="translate(100, 94)">
          <path
            d="M-18 -6 C-8 -14 8 -14 18 -6 C14 -2 8 2 0 2 C-8 2 -14 -2 -18 -6Z"
            fill={C.beak}
          />
          <path d="M-12 -4 C0 -10 12 -4 12 -4 L0 0 Z" fill={C.beakLight} opacity="0.35" />
          <path
            d="M-14 2 C-6 12 6 12 14 2 C8 6 0 8 -8 6 C-12 4 -14 2 -14 2Z"
            fill={C.beakDark}
            className={`kume-beak-lower ${beakOpen ? "kume-beak-open" : ""} ${talkOpen ? "kume-beak-talking" : ""}`}
          />
          {beakOpen && (
            <path d="M-10 4 Q0 10 10 4 Q0 7 -10 4Z" fill="#7a3535" opacity="0.75" />
          )}
        </g>
      </g>

      {/* Front wing (wave) */}
      <g className={`kume-wing-front ${excited ? "kume-wing-flap" : ""}`}>
        <path
          d="M148 132 C168 108 178 82 172 58 C166 38 148 48 138 68 C130 88 134 112 140 128 C146 142 154 146 148 132Z"
          fill={C.feather}
        />
        <path
          d="M158 118 C170 98 176 78 170 62 C164 48 152 56 146 72 C142 86 146 104 152 116Z"
          fill={C.wingTip}
        />
      </g>

      {excited && (
        <>
          <circle cx="162" cy="42" r="3.5" fill={C.sparkle} className="kume-sparkle kume-sparkle-a" />
          <circle cx="38" cy="50" r="3" fill={C.sparkle} className="kume-sparkle kume-sparkle-b" />
        </>
      )}
    </svg>
  );
}
