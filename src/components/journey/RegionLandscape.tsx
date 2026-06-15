import React from "react";
import type { LandscapeKind } from "@/lib/types";

type P = { className?: string };

export function RegionLandscape({ kind, className = "" }: { kind: LandscapeKind; className?: string }) {
  const map: Record<LandscapeKind, (p: P) => React.ReactElement> = {
    desert: Arica,
    coast: LaSerena,
    city: Valparaiso,
    wine: Santiago,
    araucania: Temuco,
    lake: Valdivia,
    volcano: Osorno,
    "chiloé": Chiloe,
    fjord: Aysen,
    patagonia: PuntaArenas,
  };
  const Comp = map[kind] ?? LaSerena;
  return <Comp className={className} />;
}

/* ── 1. ARICA — Atacama desert, Morro cliff, Pacific ── */
function Arica({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="ar-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565a8" />
          <stop offset="60%" stopColor="#e8850a" />
          <stop offset="100%" stopColor="#f4c264" />
        </linearGradient>
        <linearGradient id="ar-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a264" />
          <stop offset="100%" stopColor="#b8813a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="200" fill="url(#ar-sky)" />

      {/* Sun */}
      <circle cx="80" cy="38" r="22" fill="#ffd166" opacity="0.95" />
      <circle cx="80" cy="38" r="30" fill="#ffd166" opacity="0.18" />

      {/* Pacific Ocean strip at left */}
      <path d="M0 148 Q40 144 80 148 L80 200 L0 200 Z" fill="#1a6ba0" opacity="0.85" />
      <path d="M0 152 Q40 148 80 152" stroke="#4fc3f7" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Morro de Arica — massive dark cliff rising from ocean */}
      <path d="M55 200 L58 145 L65 120 L72 105 L82 95 L96 88 L105 90 L112 100 L118 115 L122 135 L124 200 Z"
        fill="#3a2510" />
      <path d="M65 120 L72 105 L82 95 L96 88 L105 90 L112 100"
        fill="none" stroke="#5a3820" strokeWidth="1" />
      {/* Cliff face lighter side */}
      <path d="M58 145 L65 120 L72 105 L82 95 L88 98 L90 112 L88 130 L84 155 L75 180 L60 200 Z"
        fill="#6b4420" opacity="0.5" />

      {/* Desert plateau */}
      <path d="M120 200 L120 140 Q180 132 240 138 Q280 135 320 140 L400 145 L400 200 Z"
        fill="url(#ar-sand)" />

      {/* Sand dune foreground */}
      <path d="M0 200 L0 168 Q60 155 130 165 Q200 172 280 162 Q340 155 400 165 L400 200 Z"
        fill="#c08040" />

      {/* Cardón cactus — tall, forked */}
      <rect x="197" y="125" width="6" height="38" rx="3" fill="#4a7a3a" />
      <rect x="185" y="132" width="5" height="22" rx="2.5" fill="#4a7a3a" transform="rotate(-18 185 132)" />
      <rect x="209" y="135" width="5" height="18" rx="2.5" fill="#4a7a3a" transform="rotate(20 209 135)" />

      {/* Second cactus */}
      <rect x="260" y="130" width="5" height="32" rx="2.5" fill="#4a7a3a" />
      <rect x="250" y="138" width="4" height="16" rx="2" fill="#4a7a3a" transform="rotate(-15 250 138)" />

      {/* Geoglyph — humanoid figure in sand */}
      <g opacity="0.55" stroke="#a05a20" strokeWidth="1.5" fill="none">
        <circle cx="165" cy="152" r="5" />
        <line x1="165" y1="157" x2="165" y2="170" />
        <line x1="158" y1="162" x2="172" y2="162" />
        <line x1="165" y1="170" x2="159" y2="178" />
        <line x1="165" y1="170" x2="171" y2="178" />
      </g>
    </svg>
  );
}

/* ── 2. LA SERENA — Elqui Valley, observatory, stars ── */
function LaSerena({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0d3a" />
          <stop offset="45%" stopColor="#2d1b69" />
          <stop offset="100%" stopColor="#c8742a" />
        </linearGradient>
        <linearGradient id="ls-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a5c2a" />
          <stop offset="100%" stopColor="#1e3a18" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#ls-sky)" />

      {/* Stars */}
      {[[30,20],[55,10],[90,30],[130,8],[175,22],[210,6],[250,18],[290,12],[340,25],[370,8],[60,45],[150,40],[310,38],[380,50]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.1} fill="#fff" opacity={0.7 + (i%3)*0.1} />
      ))}

      {/* Milky Way band */}
      <ellipse cx="200" cy="30" rx="160" ry="18" fill="#a0a0e0" opacity="0.08" />

      {/* Crescent moon */}
      <circle cx="330" cy="35" r="14" fill="#fff5d0" opacity="0.95" />
      <circle cx="336" cy="30" r="11" fill="#2d1b69" />

      {/* Observatory dome on hilltop */}
      <path d="M300 120 L310 80 L320 120 Z" fill="#2a3a1a" />
      <ellipse cx="310" cy="82" rx="16" ry="12" fill="#e8e0c8" />
      <ellipse cx="310" cy="82" rx="16" ry="12" fill="none" stroke="#c8b880" strokeWidth="1.5" />
      <rect x="303" y="82" width="14" height="8" fill="#e8e0c8" />
      {/* Dome opening */}
      <path d="M303 78 Q310 72 317 78" fill="#1a1a4a" />

      {/* Elqui Valley hillsides */}
      <path d="M0 140 L50 105 L100 120 L160 95 L220 110 L280 85 L330 100 L360 80 L400 95 L400 200 L0 200 Z"
        fill="url(#ls-hill)" />

      {/* Vineyard rows on slope */}
      {[0,1,2,3,4].map(i => (
        <path key={i}
          d={`M${160+i*12} ${115-i*4} Q${180+i*12} ${112-i*4} ${200+i*12} ${115-i*4}`}
          stroke="#4a7a30" strokeWidth="2" fill="none" opacity="0.7" />
      ))}

      {/* Río Elqui — silver strip */}
      <path d="M0 170 Q100 162 200 168 Q300 172 400 165 L400 200 L0 200 Z"
        fill="#3a6a90" opacity="0.55" />

      {/* Warm horizon glow */}
      <path d="M0 200 L0 175 Q200 168 400 175 L400 200 Z" fill="#c8742a" opacity="0.3" />
    </svg>
  );
}

/* ── 3. VALPARAÍSO — Colorful cerros, funicular, port ── */
function Valparaiso({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="vp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3da5d9" />
          <stop offset="100%" stopColor="#9dd4f0" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#vp-sky)" />

      {/* Pacific Ocean */}
      <path d="M0 155 Q100 148 200 152 Q300 156 400 150 L400 200 L0 200 Z" fill="#1565a8" />
      <path d="M0 162 Q100 156 200 160 Q300 163 400 158" stroke="#4fc3f7" strokeWidth="1.2" fill="none" opacity="0.6" />

      {/* Container ship in port */}
      <rect x="20" y="155" width="80" height="18" rx="2" fill="#546e7a" />
      <rect x="25" y="143" width="20" height="12" fill="#37474f" />
      <rect x="50" y="147" width="14" height="8" fill="#e53935" opacity="0.8" />
      <rect x="68" y="147" width="14" height="8" fill="#1565c0" opacity="0.8" />
      <rect x="86" y="147" width="12" height="8" fill="#fbc02d" opacity="0.8" />

      {/* Cerro — hillside rising steeply */}
      <path d="M180 200 L185 80 L210 60 L240 75 L260 90 L280 110 L300 130 L330 155 L400 165 L400 200 Z"
        fill="#8b6f47" />
      <path d="M185 80 L210 60 L240 75"
        fill="none" stroke="#6b5035" strokeWidth="1" />

      {/* Colorful houses cascading down the cerro */}
      {/* Row 3 — high */}
      <rect x="192" y="88" width="16" height="18" rx="1" fill="#e53935" />
      <path d="M190 88 L200 80 L210 88 Z" fill="#c62828" />
      <rect x="212" y="92" width="15" height="16" rx="1" fill="#fbc02d" />
      <path d="M210 92 L219 85 L228 92 Z" fill="#f9a825" />
      <rect x="230" y="98" width="16" height="15" rx="1" fill="#1565c0" />
      <path d="M228 98 L238 91 L248 98 Z" fill="#0d47a1" />

      {/* Row 2 — mid */}
      <rect x="205" y="108" width="15" height="16" rx="1" fill="#2e7d32" />
      <path d="M203 108 L212 101 L221 108 Z" fill="#1b5e20" />
      <rect x="223" y="112" width="16" height="15" rx="1" fill="#e53935" />
      <path d="M221 112 L231 105 L241 112 Z" fill="#b71c1c" />
      <rect x="243" y="118" width="14" height="14" rx="1" fill="#6a1599" opacity="0.9" />
      <path d="M241 118 L250 111 L259 118 Z" fill="#4a0e72" />

      {/* Row 1 — lower */}
      <rect x="225" y="130" width="18" height="16" rx="1" fill="#fbc02d" />
      <rect x="247" y="134" width="16" height="15" rx="1" fill="#e53935" />
      <rect x="267" y="138" width="18" height="14" rx="1" fill="#1565c0" />
      <rect x="289" y="142" width="16" height="14" rx="1" fill="#2e7d32" />

      {/* Funicular track — diagonal line */}
      <line x1="200" y1="195" x2="218" y2="85" stroke="#8b6f47" strokeWidth="3" opacity="0.7" />
      <line x1="205" y1="195" x2="223" y2="85" stroke="#5c4030" strokeWidth="1.5" opacity="0.5" />
      {/* Funicular car */}
      <rect x="207" y="138" width="12" height="16" rx="2" fill="#fbc02d" transform="rotate(-75 207 138)" />

      {/* Seagulls */}
      <path d="M130 55 Q133 51 136 55 Q139 51 142 55" stroke="#1d3557" strokeWidth="1.5" fill="none" />
      <path d="M155 45 Q157 42 160 45 Q162 42 165 45" stroke="#1d3557" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ── 4. SANTIAGO — Andes backdrop, urban skyline ── */
function Santiago({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#90caf9" />
          <stop offset="60%" stopColor="#cfe8f5" />
          <stop offset="100%" stopColor="#e8d5b0" />
        </linearGradient>
        <linearGradient id="sg-andes" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0ece8" />
          <stop offset="40%" stopColor="#9e9e9e" />
          <stop offset="100%" stopColor="#757575" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#sg-sky)" />

      {/* Smog haze layer */}
      <rect y="100" width="400" height="40" fill="#c8b890" opacity="0.22" />

      {/* Andes mountain range — massive snow peaks */}
      <path d="M180 200 L190 50 L210 30 L230 55 L250 40 L270 60 L290 45 L315 70 L340 55 L380 80 L400 90 L400 200 Z"
        fill="url(#sg-andes)" />
      {/* Snow caps */}
      <path d="M210 30 L220 50 L230 55 L218 45 Z" fill="white" opacity="0.95" />
      <path d="M250 40 L260 58 L270 60 L258 50 Z" fill="white" opacity="0.9" />
      <path d="M290 45 L300 63 L315 70 L300 55 Z" fill="white" opacity="0.85" />
      <path d="M340 55 L350 70 L365 72 L352 62 Z" fill="white" opacity="0.8" />
      {/* Mountain shadow/shading */}
      <path d="M210 30 L195 80 L205 90 L220 50 Z" fill="#5a5a5a" opacity="0.25" />
      <path d="M250 40 L238 85 L255 90 L262 58 Z" fill="#5a5a5a" opacity="0.2" />

      {/* Cerro San Cristóbal — green hill with cross */}
      <path d="M0 160 L60 110 L100 125 L130 108 L160 120 L180 200 L0 200 Z"
        fill="#5a8a4a" />
      <line x1="118" y1="108" x2="118" y2="90" stroke="white" strokeWidth="3" />
      <line x1="110" y1="97" x2="126" y2="97" stroke="white" strokeWidth="3" />

      {/* Urban skyline in front */}
      {[
        [170,120,22,80],[196,130,18,70],[218,115,25,85],[247,125,20,75],
        [271,118,16,82],[291,128,28,72],[323,122,22,78],[349,130,18,70],
      ].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={i%3===0?"#455a64":i%3===1?"#546e7a":"#37474f"} rx="1" />
      ))}
      {/* Gran Torre Santiago */}
      <rect x="218" y="95" width="25" height="105" fill="#546e7a" rx="1" />
      <rect x="222" y="90" width="17" height="10" fill="#455a64" rx="1" />
      <line x1="230" y1="90" x2="230" y2="80" stroke="#8899aa" strokeWidth="2" />

      {/* Mapocho river */}
      <path d="M0 190 Q100 183 200 187 Q300 191 400 185 L400 200 L0 200 Z"
        fill="#1976d2" opacity="0.45" />
    </svg>
  );
}

/* ── 5. TEMUCO — Araucaria trees, Mapuche landscape ── */
function Temuco({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="tm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a7a5a" />
          <stop offset="50%" stopColor="#7aaa80" />
          <stop offset="100%" stopColor="#b0c890" />
        </linearGradient>
        <linearGradient id="tm-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e5e30" />
          <stop offset="100%" stopColor="#1a3a1c" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#tm-sky)" />

      {/* Low cloud/mist layer */}
      <path d="M0 80 Q100 72 200 78 Q300 82 400 75 L400 90 Q300 97 200 93 Q100 89 0 95 Z"
        fill="white" opacity="0.18" />

      {/* Rolling hills — Wallmapu */}
      <path d="M0 130 Q60 108 120 122 Q180 105 240 118 Q300 102 360 115 L400 110 L400 200 L0 200 Z"
        fill="url(#tm-hill)" />
      <path d="M0 145 Q80 135 160 142 Q240 135 320 140 L400 137 L400 200 L0 200 Z"
        fill="#1e4020" />

      {/* Ruka — Mapuche traditional house */}
      <path d="M40 158 L58 130 L76 158 Z" fill="#8b6030" />
      <rect x="44" y="148" width="28" height="12" fill="#6b4820" />
      {/* Ruka door */}
      <rect x="54" y="151" width="8" height="9" fill="#3a2810" />
      {/* Thatch texture lines */}
      <line x1="49" y1="130" x2="44" y2="148" stroke="#5c3818" strokeWidth="1" opacity="0.5" />
      <line x1="55" y1="128" x2="50" y2="148" stroke="#5c3818" strokeWidth="1" opacity="0.5" />
      <line x1="61" y1="127" x2="58" y2="148" stroke="#5c3818" strokeWidth="1" opacity="0.5" />
      <line x1="67" y1="128" x2="66" y2="148" stroke="#5c3818" strokeWidth="1" opacity="0.5" />
      <line x1="73" y1="130" x2="72" y2="148" stroke="#5c3818" strokeWidth="1" opacity="0.5" />

      {/* Kultrun symbol in sky */}
      <g opacity="0.3" stroke="#c8542a" fill="none">
        <circle cx="340" cy="45" r="22" strokeWidth="2" />
        <line x1="340" y1="23" x2="340" y2="67" strokeWidth="1.5" />
        <line x1="318" y1="45" x2="362" y2="45" strokeWidth="1.5" />
        <line x1="325" y1="30" x2="355" y2="60" strokeWidth="1" />
        <line x1="355" y1="30" x2="325" y2="60" strokeWidth="1" />
      </g>

      {/* Araucaria trees — the most distinctive feature */}
      {/* Tree 1 — large, center */}
      <AraucariaTree x={200} y={155} h={65} />
      {/* Tree 2 — right */}
      <AraucariaTree x={290} y={148} h={55} />
      {/* Tree 3 — left, smaller */}
      <AraucariaTree x={130} y={155} h={48} />
      {/* Tree 4 — far right, small */}
      <AraucariaTree x={360} y={152} h={42} />
    </svg>
  );
}

function AraucariaTree({ x, y, h }: { x: number; y: number; h: number }) {
  const trunk = h * 0.35;
  const crown = h * 0.65;
  const tiers = 5;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Trunk */}
      <rect x={-3} y={-trunk} width={6} height={trunk} rx="2" fill="#5c3818" />
      {/* Crown tiers — radiating branches getting wider toward base */}
      {Array.from({ length: tiers }).map((_, i) => {
        const ty = -trunk - (crown * (i + 1)) / tiers;
        const spread = 4 + i * 5;
        const len = 5 + i * 4;
        return (
          <g key={i}>
            {/* Left branch */}
            <path
              d={`M0 ${ty} L${-spread} ${ty + len * 0.6} L${-spread * 1.3} ${ty + len}`}
              stroke="#2a4a22" strokeWidth={2.5 - i * 0.3} fill="none" strokeLinecap="round"
            />
            {/* Right branch */}
            <path
              d={`M0 ${ty} L${spread} ${ty + len * 0.6} L${spread * 1.3} ${ty + len}`}
              stroke="#2a4a22" strokeWidth={2.5 - i * 0.3} fill="none" strokeLinecap="round"
            />
          </g>
        );
      })}
      {/* Crown tip */}
      <circle cx={0} cy={-trunk - crown} r={3} fill="#2a4a22" />
    </g>
  );
}

/* ── 6. VALDIVIA — River, sea lions, temperate rainforest ── */
function Valdivia({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="vd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a8898" />
          <stop offset="100%" stopColor="#a8bcc8" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#vd-sky)" />

      {/* Rain — vertical streaks */}
      {[20,45,70,95,120,155,190,225,260,295,330,365].map((x,i) => (
        <line key={i} x1={x} y1={0} x2={x-5} y2={40} stroke="#7aa0b8" strokeWidth="0.8" opacity="0.4" />
      ))}

      {/* Lush forest backdrop */}
      <path d="M0 100 Q50 80 100 90 Q150 75 200 85 Q250 70 300 82 Q350 68 400 78 L400 200 L0 200 Z"
        fill="#1e4a20" />
      <path d="M0 115 Q70 100 140 110 Q200 100 260 108 Q320 98 400 105 L400 200 L0 200 Z"
        fill="#153618" />

      {/* Río Calle Calle / Valdivia — wide river */}
      <path d="M0 155 Q200 145 400 152 L400 200 L0 200 Z" fill="#3a6a8a" opacity="0.85" />
      <path d="M0 158 Q100 153 200 155 Q300 158 400 155" stroke="#5a8aaa" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Wooden dock / pier */}
      <rect x="100" y="148" width="8" height="30" fill="#5c3818" rx="2" />
      <rect x="120" y="148" width="8" height="30" fill="#5c3818" rx="2" />
      <rect x="140" y="148" width="8" height="30" fill="#5c3818" rx="2" />
      <rect x="95" y="147" width="60" height="6" fill="#7a5030" rx="2" />

      {/* Sea lion on dock */}
      <ellipse cx="155" cy="145" rx="14" ry="7" fill="#4a3520" />
      <ellipse cx="166" cy="143" rx="7" ry="5" fill="#3a2818" />
      <ellipse cx="172" cy="142" rx="4" ry="3" fill="#2a1808" />
      <circle cx="175" cy="140" r="2" fill="#1a1008" />
      {/* Whiskers */}
      <line x1="172" y1="141" x2="179" y2="139" stroke="#8a7060" strokeWidth="0.8" />
      <line x1="172" y1="142" x2="179" y2="142" stroke="#8a7060" strokeWidth="0.8" />

      {/* German-influenced building */}
      <rect x="240" y="118" width="60" height="40" fill="#c8a870" />
      <path d="M236 118 L270 95 L304 118 Z" fill="#b03020" />
      <rect x="248" y="127" width="10" height="14" fill="#8a7050" />
      <rect x="274" y="127" width="10" height="14" fill="#8a7050" />
      <rect x="248" y="124" width="10" height="3" fill="#a08860" />
      <rect x="274" y="124" width="10" height="3" fill="#a08860" />
      {/* Window panes */}
      <line x1="253" y1="127" x2="253" y2="141" stroke="#706040" strokeWidth="0.8" />
      <line x1="248" y1="134" x2="258" y2="134" stroke="#706040" strokeWidth="0.8" />
    </svg>
  );
}

/* ── 7. OSORNO — Volcano cone, Lake Llanquihue ── */
function Osorno({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="os-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e88d8" />
          <stop offset="100%" stopColor="#80cbf0" />
        </linearGradient>
        <linearGradient id="os-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e88d8" opacity="0.9" />
          <stop offset="100%" stopColor="#0d5a9a" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#os-sky)" />

      {/* Green pastoral field */}
      <path d="M0 160 Q200 150 400 158 L400 200 L0 200 Z" fill="#4a9a30" />

      {/* Lake Llanquihue */}
      <path d="M0 150 Q200 142 400 148 L400 165 Q200 158 0 163 Z" fill="url(#os-lake)" />

      {/* Volcano reflection in lake */}
      <path d="M148 150 L200 158 L252 150 L226 154 L200 160 L174 154 Z"
        fill="white" opacity="0.25" />

      {/* Osorno Volcano — perfect symmetrical cone, the hero of this scene */}
      <path d="M120 200 L200 22 L280 200 Z" fill="#7a8898" />
      {/* Volcano left shadow face */}
      <path d="M120 200 L200 22 L180 80 L160 120 L140 160 Z" fill="#5a6878" />
      {/* Snow cap — generous and pure white */}
      <path d="M200 22 L170 75 L180 78 L200 45 L220 78 L230 75 Z" fill="white" opacity="0.98" />
      <path d="M170 75 L180 78 L200 58 L220 78 L230 75 L215 80 L200 65 L185 80 Z"
        fill="#e8f0f8" opacity="0.85" />
      {/* Crater at peak */}
      <ellipse cx="200" cy="24" rx="4" ry="2" fill="#8a8890" />

      {/* Trees in foreground — forest edge */}
      {[30,60,330,360].map((x,i) => (
        <g key={i} transform={`translate(${x},165)`}>
          <rect x="-3" y="-25" width="6" height="25" fill="#3a5830" rx="2" />
          <path d="M-10,-25 L0,-45 L10,-25 Z" fill="#2a4820" />
          <path d="M-8,-32 L0,-48 L8,-32 Z" fill="#2a4820" />
        </g>
      ))}

      {/* Cow silhouette */}
      <g transform="translate(80,160)" fill="#3a2818">
        <ellipse cx="0" cy="0" rx="14" ry="8" />
        <ellipse cx="13" cy="-4" rx="6" ry="5" />
        {/* Legs */}
        <rect x="-10" y="6" width="3" height="8" rx="1" />
        <rect x="-4" y="6" width="3" height="8" rx="1" />
        <rect x="4" y="6" width="3" height="8" rx="1" />
        <rect x="10" y="6" width="3" height="8" rx="1" />
        {/* Head details */}
        <ellipse cx="18" cy="-5" rx="4" ry="3" fill="#2a1808" />
      </g>
    </svg>
  );
}

/* ── 8. CHILOÉ — Palafitos, church, fog, island ── */
function Chiloe({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="ch-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a9ab0" />
          <stop offset="100%" stopColor="#b0c8d8" />
        </linearGradient>
        <linearGradient id="ch-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a8090" />
          <stop offset="100%" stopColor="#3a6070" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#ch-sky)" />

      {/* Fog wisps on hills */}
      <path d="M240 90 Q270 85 300 90 Q330 85 360 92 L360 100 Q330 97 300 102 Q270 97 240 102 Z"
        fill="white" opacity="0.3" />
      <path d="M0 105 Q50 98 100 105 Q130 100 160 107 L160 115 Q130 110 100 115 Q50 110 0 117 Z"
        fill="white" opacity="0.25" />

      {/* Island silhouette background */}
      <path d="M200 200 L200 115 Q240 108 280 115 Q320 108 360 118 L400 115 L400 200 Z"
        fill="#3a5a40" opacity="0.7" />

      {/* Sea */}
      <path d="M0 145 Q200 138 400 143 L400 200 L0 200 Z" fill="url(#ch-sea)" />
      <path d="M0 150 Q100 146 200 149 Q300 152 400 148" stroke="#7aaabb" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M0 158 Q80 154 160 157 Q240 160 320 156 Q360 154 400 157" stroke="#6a9aaa" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Palafitos — colorful houses on stilts over water */}
      {/* House 1 — red */}
      <rect x="55" y="125" width="32" height="28" rx="1" fill="#c8302a" />
      <path d="M52 125 L71 108 L90 125 Z" fill="#a02020" />
      <rect x="62" y="133" width="8" height="12" rx="1" fill="#5a1a18" />
      {/* Window */}
      <rect x="73" y="128" width="8" height="7" rx="1" fill="#c8e8f8" opacity="0.8" />
      {/* Stilts */}
      <rect x="60" y="153" width="4" height="28" fill="#5c3818" rx="2" />
      <rect x="72" y="153" width="4" height="28" fill="#5c3818" rx="2" />
      <rect x="80" y="153" width="4" height="28" fill="#5c3818" rx="2" />

      {/* House 2 — yellow */}
      <rect x="95" y="122" width="30" height="31" rx="1" fill="#d4a820" />
      <path d="M92 122 L110 106 L128 122 Z" fill="#b08018" />
      <rect x="101" y="131" width="8" height="13" rx="1" fill="#705010" />
      <rect x="112" y="126" width="8" height="7" rx="1" fill="#c8e8f8" opacity="0.8" />
      {/* Stilts */}
      <rect x="100" y="153" width="4" height="28" fill="#5c3818" rx="2" />
      <rect x="112" y="153" width="4" height="28" fill="#5c3818" rx="2" />
      <rect x="121" y="153" width="4" height="28" fill="#5c3818" rx="2" />

      {/* House 3 — blue */}
      <rect x="133" y="128" width="28" height="25" rx="1" fill="#1a5fa0" />
      <path d="M130 128 L147 113 L164 128 Z" fill="#124080" />
      <rect x="139" y="136" width="7" height="11" rx="1" fill="#082840" />
      <rect x="148" y="131" width="8" height="7" rx="1" fill="#c8e8f8" opacity="0.8" />
      <rect x="134" y="153" width="4" height="28" fill="#5c3818" rx="2" />
      <rect x="147" y="153" width="4" height="28" fill="#5c3818" rx="2" />
      <rect x="158" y="153" width="4" height="28" fill="#5c3818" rx="2" />

      {/* Wooden church — UNESCO heritage */}
      <rect x="260" y="112" width="45" height="38" fill="#e8dcc8" />
      {/* Bell tower */}
      <rect x="278" y="90" width="12" height="24" fill="#d8ccb8" />
      <path d="M275 90 L284 76 L293 90 Z" fill="#b03028" />
      {/* Cross */}
      <line x1="284" y1="76" x2="284" y2="65" stroke="#d8ccb8" strokeWidth="2.5" />
      <line x1="279" y1="69" x2="289" y2="69" stroke="#d8ccb8" strokeWidth="2.5" />
      {/* Church windows */}
      <rect x="264" y="120" width="10" height="14" rx="3" fill="#4a6a80" opacity="0.7" />
      <rect x="291" y="120" width="10" height="14" rx="3" fill="#4a6a80" opacity="0.7" />
      {/* Church door */}
      <rect x="275" y="132" width="12" height="18" rx="3" fill="#5a4030" />

      {/* Dalca boat */}
      <path d="M180 160 Q210 156 235 160 L230 168 Q210 165 185 168 Z" fill="#5c3818" />
      <line x1="207" y1="157" x2="207" y2="143" stroke="#3a2010" strokeWidth="2" />
      <path d="M207 143 L220 150 L207 157 Z" fill="#c83020" opacity="0.8" />
    </svg>
  );
}

/* ── 9. AYSÉN — Fjords, condor, glacier water ── */
function Aysen({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="ay-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a3a" />
          <stop offset="60%" stopColor="#2a4a5a" />
          <stop offset="100%" stopColor="#3a7a8a" />
        </linearGradient>
        <linearGradient id="ay-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1ab8c8" />
          <stop offset="100%" stopColor="#0a7888" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#ay-sky)" />

      {/* Dramatic storm clouds */}
      <path d="M0 30 Q60 20 120 28 Q160 22 200 30 Q240 22 280 30 Q320 22 380 28 L400 35 Q350 45 280 40 Q200 48 120 42 Q60 48 0 42 Z"
        fill="#2a3a4a" opacity="0.6" />

      {/* Left cliff wall — sheer granite */}
      <path d="M0 0 L0 200 L70 200 L75 160 L68 130 L72 100 L65 70 L70 40 L62 10 L0 0 Z"
        fill="#3a3a3a" />
      {/* Left cliff face texture */}
      <path d="M40 40 L45 70 L38 100 L42 130 L38 160 L45 200"
        stroke="#5a5a5a" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M20 60 L25 90 L20 120 L24 150"
        stroke="#4a4a4a" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Snow/ice on cliff edge */}
      <path d="M0 0 L62 10 L58 18 L50 15 L40 22 L30 18 L20 25 L10 20 L0 28 Z"
        fill="#e8f0f8" opacity="0.7" />

      {/* Right cliff wall */}
      <path d="M400 0 L400 200 L330 200 L325 155 L332 125 L328 95 L335 65 L328 35 L338 5 L400 0 Z"
        fill="#2a2a2a" />
      <path d="M365 35 L360 65 L368 95 L362 125 L368 155"
        stroke="#4a4a4a" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M400 0 L338 5 L342 14 L352 10 L362 18 L372 12 L382 20 L392 14 L400 22 Z"
        fill="#e8f0f8" opacity="0.65" />

      {/* Turquoise glacial fjord water */}
      <path d="M65 170 Q200 158 335 168 L335 200 L65 200 Z" fill="url(#ay-water)" />
      <path d="M65 172 Q200 162 335 170" stroke="#5adae8" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Ice/glacier floating */}
      <path d="M160 168 L168 160 L176 168 L170 172 L162 172 Z" fill="white" opacity="0.7" />
      <path d="M220 165 L226 159 L232 165 L228 169 L222 169 Z" fill="white" opacity="0.65" />

      {/* Marble cave tones on water */}
      <ellipse cx="200" cy="175" rx="45" ry="8" fill="#40c8d8" opacity="0.4" />

      {/* Condor soaring — wide wingspan silhouette */}
      <g transform="translate(210,55)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="12" ry="5" fill="#1a1a1a" />
        {/* White collar */}
        <ellipse cx="6" cy="-2" rx="5" ry="3" fill="#f0e8d8" />
        {/* Massive wings */}
        <path d="M-12 0 Q-30 -8 -55 -4 Q-65 -2 -70 4 Q-60 6 -45 2 Q-30 -2 -12 4 Z"
          fill="#1a1a1a" />
        <path d="M12 0 Q30 -8 55 -4 Q65 -2 70 4 Q60 6 45 2 Q30 -2 12 4 Z"
          fill="#1a1a1a" />
        {/* Wing tips */}
        <path d="M-55 -4 Q-68 -1 -72 5 Q-65 3 -58 2 Z" fill="#2a2a2a" />
        <path d="M55 -4 Q68 -1 72 5 Q65 3 58 2 Z" fill="#2a2a2a" />
        {/* Head */}
        <circle cx="14" cy="-4" r="5" fill="#c84820" />
      </g>
    </svg>
  );
}

/* ── 10. PUNTA ARENAS — Torres del Paine, penguins, Magellan ── */
function PuntaArenas({ className }: P) {
  return (
    <svg viewBox="0 0 400 200" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a2a" />
          <stop offset="35%" stopColor="#1a1a4a" />
          <stop offset="65%" stopColor="#c84820" />
          <stop offset="100%" stopColor="#f09030" />
        </linearGradient>
        <linearGradient id="pa-aurora" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0088ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill="url(#pa-sky)" />

      {/* Aurora Australis */}
      <ellipse cx="150" cy="40" rx="180" ry="50" fill="url(#pa-aurora)" />
      <path d="M60 20 Q100 50 80 80" stroke="#00cc66" strokeWidth="2" fill="none" opacity="0.2" />
      <path d="M120 10 Q150 45 130 75" stroke="#3388ff" strokeWidth="1.5" fill="none" opacity="0.18" />
      <path d="M80 15 Q110 48 95 78" stroke="#00cc88" strokeWidth="1" fill="none" opacity="0.15" />

      {/* Stars */}
      {[[15,12],[35,8],[55,18],[200,10],[220,6],[380,15],[365,8],[345,20]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={1.2} fill="white" opacity={0.7} />
      ))}

      {/* Strait of Magellan — dark, ominous water */}
      <path d="M0 155 Q200 148 400 153 L400 200 L0 200 Z" fill="#0a1a28" opacity="0.95" />
      <path d="M0 158 Q100 154 200 157 Q300 160 400 156" stroke="#2a4a6a" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Wind-swept grass / steppe */}
      <path d="M0 155 Q200 148 400 153 L400 165 Q200 162 0 168 Z" fill="#3a5028" opacity="0.7" />

      {/* Torres del Paine — iconic granite towers */}
      {/* Main cluster of three towers */}
      <path d="M218 155 L222 75 L226 155 Z" fill="#4a4a52" />
      <path d="M218 155 L220 92 L222 75 L218 105 Z" fill="#3a3a42" />
      <path d="M222 75 L224 68 L228 75 L226 65 L222 60 Z" fill="#c8d0d8" opacity="0.9" />

      <path d="M232 155 L236 88 L240 155 Z" fill="#4a4a52" />
      <path d="M232 155 L234 100 L236 88 L232 112 Z" fill="#3a3a42" />
      <path d="M236 88 L238 80 L242 88 L240 78 L236 72 Z" fill="#c8d0d8" opacity="0.9" />

      <path d="M244 155 L248 98 L252 155 Z" fill="#4a4a52" />
      <path d="M244 155 L246 108 L248 98 L244 118 Z" fill="#3a3a42" />
      <path d="M248 98 L250 90 L254 98 L252 87 L248 82 Z" fill="#d8e0e8" opacity="0.85" />

      {/* Smaller towers behind */}
      <path d="M206 155 L209 100 L212 155 Z" fill="#3a3a3a" opacity="0.7" />
      <path d="M258 155 L261 108 L264 155 Z" fill="#3a3a3a" opacity="0.65" />

      {/* Magellanic penguins on shore */}
      <Penguin x={60} y={152} />
      <Penguin x={82} y={155} />
      <Penguin x={102} y={151} />

      {/* Dramatic horizontal wind clouds */}
      <path d="M270 120 Q310 115 360 120 Q380 118 400 122" stroke="#c8c0a8" strokeWidth="6" fill="none" opacity="0.22" strokeLinecap="round" />
      <path d="M240 108 Q290 103 350 107 Q375 105 400 108" stroke="#c8c0a8" strokeWidth="4" fill="none" opacity="0.18" strokeLinecap="round" />
      <path d="M300 95 Q340 90 380 95 Q390 93 400 95" stroke="#c8c0a8" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

function Penguin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body */}
      <ellipse cx="0" cy="0" rx="6" ry="9" fill="#1a1a1a" />
      {/* White belly */}
      <ellipse cx="0" cy="2" rx="4" ry="6" fill="#f0f0f0" />
      {/* Head */}
      <circle cx="0" cy="-9" r="5" fill="#1a1a1a" />
      {/* White eye patches */}
      <ellipse cx="-2" cy="-10" rx="2.5" ry="2" fill="white" />
      <ellipse cx="2" cy="-10" rx="2.5" ry="2" fill="white" />
      {/* Eyes */}
      <circle cx="-2" cy="-10" r="1" fill="#1a1a1a" />
      <circle cx="2" cy="-10" r="1" fill="#1a1a1a" />
      {/* Beak */}
      <path d="M-1 -7 L0 -5 L1 -7" fill="#e87820" />
      {/* Flippers */}
      <path d="M-6 -4 Q-10 -1 -8 5" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M6 -4 Q10 -1 8 5" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <path d="M-3 9 L-5 13 M0 9 L0 13 M3 9 L5 13" stroke="#e87820" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}
