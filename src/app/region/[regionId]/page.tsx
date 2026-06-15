"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KumeStopGuide } from "@/components/journey/ChileMap";
import { RegionLandscape } from "@/components/journey/RegionLandscape";
import { KumeHero } from "@/components/kume/KumeHero";
import { getRegion, isRegionComplete, isRegionUnlocked } from "@/lib/data/regions";
import { useProgress } from "@/lib/store/progress";

// ── Unique icon per lesson (by region + lesson order) ─────────────────────────
const REGION_ICONS: Record<string, string[]> = {
  arica:          ["👋", "🔥", "🌵"],
  "la-serena":    ["⭐", "✋", "🔢"],
  valparaiso:     ["🌱", "🪵", "👴"],
  santiago:       ["💧", "🌾", "🌲"],
  temuco:         ["🌍", "🌧️", "☀️"],
  valdivia:       ["🦊", "🐕", "🦉"],
  osorno:         ["🏠", "🪵", "🌙"],
  chiloe:         ["📖", "🌊", "🏛️"],
  aysen:          ["💨", "❄️", "🏔️"],
  "punta-arenas": ["🗺️", "🌬️", "🦅"],
};

// ── SVG coordinate map for stops (W=320, 3-stop layout) ──────────────────────
// Nodes: center (160,60) → left (72,216) → right (248,372)
// Path curves like a real trail on a treasure map
const MAP_W = 320;
const MAP_TOP = 60;
const MAP_STEP = 156;
const MAP_BOT = 80;

function buildMapLayout(n: number) {
  const H = MAP_TOP + MAP_STEP * (n - 1) + MAP_BOT;
  const XS = [MAP_W / 2, 72, MAP_W - 72, MAP_W / 2, 72, MAP_W - 72];
  const nodes = Array.from({ length: n }, (_, i) => ({
    x: XS[i % XS.length],
    y: MAP_TOP + i * MAP_STEP,
  }));
  // Cubic bezier curves — each segment bows toward the midpoint
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const p = nodes[i - 1];
    const c = nodes[i];
    const midY = (p.y + c.y) / 2;
    d += ` C ${p.x} ${midY} ${c.x} ${midY} ${c.x} ${c.y}`;
  }
  return { W: MAP_W, H, nodes, path: d };
}

// ── Themed SVG decorations per landscape ─────────────────────────────────────
// 10 slots around the 3-stop path (works for any count — just cycles)
type Deco = { x: number; y: number; e: string; s: number };

// Fixed slot positions for W=320 layout (layout-relative, always the same)
const BASE_SLOTS: Omit<Deco, "e">[] = [
  { x: 256, y: 96,  s: 26 },
  { x: 36,  y: 108, s: 24 },
  { x: 272, y: 162, s: 22 },
  { x: 38,  y: 170, s: 20 },
  { x: 186, y: 214, s: 18 },
  { x: 268, y: 252, s: 22 },
  { x: 38,  y: 280, s: 20 },
  { x: 272, y: 308, s: 24 },
  { x: 38,  y: 362, s: 22 },
  { x: 148, y: 345, s: 20 },
];

const LANDSCAPE_EMOJIS: Record<string, string[]> = {
  desert:    ["🌵", "☀️", "🌵", "🪨",  "🌾",  "🌵", "⛅",  "🏔️", "🌞", "🌵"],
  wine:      ["🍇", "🌿", "🌻", "🌾",  "⭐",  "🍇", "🌟",  "🍃", "🌻", "🌿"],
  coast:     ["⚓", "🌊", "⛵", "🌊",  "🐟",  "🌊", "🐚",  "⛵", "🌊", "🦀"],
  city:      ["🏔️","🌃", "🌆", "🏙️", "🌉",  "🌃", "🏛️", "🌆", "🌿", "🌆"],
  araucania: ["🌲", "🍃", "🌲", "🌿",  "🦋",  "🌲", "🍄",  "🌺", "🌲", "🍀"],
  lake:      ["🏔️","💧", "🌊", "🌿",  "🦆",  "🌊", "🏔️", "💧", "🦅", "🌊"],
  volcano:   ["🌋", "❄️", "💨", "🌿",  "🏔️", "🌋", "❄️", "🌿", "💨", "🌊"],
  "chiloé":  ["⚓", "🌧️","⛵", "🌊",  "🐚",  "🌊", "🍄",  "🌿", "⚓", "🌧️"],
  fjord:     ["🏔️","🦅", "❄️", "💨",  "🌊",  "🏔️","🌊",  "❄️", "💨", "🦅"],
  patagonia: ["🌬️","🦙", "❄️", "🌿",  "🏔️", "🌬️","⛄",  "🦙", "🌬️","❄️"],
};

function getDecorations(landscape: string): Deco[] {
  const emojis = LANDSCAPE_EMOJIS[landscape] ?? LANDSCAPE_EMOJIS.araucania;
  return BASE_SLOTS.map((slot, i) => ({ ...slot, e: emojis[i % emojis.length] }));
}

export default function RegionPage({
  params,
}: {
  params: Promise<{ regionId: string }>;
}) {
  const { regionId } = use(params);
  const region = getRegion(regionId);
  const { isLessonCompleted, getUnitProgress, loaded } = useProgress();

  if (!region) notFound();

  const unlocked =
    loaded && isRegionUnlocked(regionId, isLessonCompleted);
  if (loaded && !unlocked) notFound();

  const { completed, total } = getUnitProgress(region.lessons.map((l) => l.id));
  const nextLesson =
    region.lessons.find((l) => !isLessonCompleted(l.id)) ?? region.lessons[0];

  const complete = loaded && isRegionComplete(regionId, isLessonCompleted);
  const isCurrent =
    loaded &&
    unlocked &&
    !complete &&
    region.lessons.length > 0;

  return (
    <AppShell fullBleed>
      <Link
        href="/"
        className="absolute left-4 top-[3.75rem] z-20 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-teal shadow-md backdrop-blur-sm"
      >
        ← Ruta
      </Link>

      <div className="relative h-52 overflow-hidden">
        <RegionLandscape kind={region.theme.landscape} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 drop-shadow">
            {region.latitude}
          </p>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta drop-shadow">
            {region.topic}
          </p>
          <h1 className="text-2xl font-extrabold leading-tight text-charcoal drop-shadow-sm">
            {region.name}
          </h1>
          <p className="text-sm font-medium text-earth-muted">{region.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <KumeStopGuide
          region={region}
          unlocked={unlocked}
          complete={complete}
          isCurrent={isCurrent}
        />

        {region.lessons.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-sand-dark bg-sand/30 px-4 py-10 text-center">
            <KumeHero emotion="thinking" animation="float" size={120} className="mx-auto mb-3" />
            <p className="font-bold text-charcoal">Próxima parada del camino</p>
            <p className="mt-1 text-sm text-earth-muted">
              Pudu aún prepara las palabras de {region.topic.toLowerCase()}.
            </p>
            <Link href="/" className="mt-4 inline-block font-bold text-teal">
              Volver a la ruta
            </Link>
          </div>
        ) : (
          <>
            {total > 0 && (
              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Paradas visitadas</span>
                  <span className="text-sage">
                    {completed}/{total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-sage transition-all"
                    style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── SVG map path ────────────────────────────────────────── */}
            {(() => {
              const { W, H, nodes, path } = buildMapLayout(region.lessons.length);
              const decos = getDecorations(region.theme.landscape);
              return (
                <div
                  className="relative mx-auto w-full"
                  style={{ aspectRatio: `${W} / ${H}` }}
                  aria-label="Mapa de paradas"
                >
                  {/* ── Background SVG: path + emoji decorations ── */}
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="absolute inset-0 h-full w-full overflow-visible"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Subtle ground texture dots */}
                    {Array.from({ length: 18 }, (_, k) => (
                      <circle
                        key={k}
                        cx={20 + ((k * 73) % (W - 40))}
                        cy={30 + ((k * 61) % (H - 60))}
                        r="1.5"
                        fill="rgba(139,94,60,0.18)"
                      />
                    ))}

                    {/* Path outer glow */}
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(200,84,42,0.12)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Dirt road base */}
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(180,120,60,0.22)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Main dashed route line */}
                    <path
                      d={path}
                      fill="none"
                      stroke="#c8542a"
                      strokeWidth="3"
                      strokeDasharray="14 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.72"
                    />

                    {/* Compass rose — bottom-right corner */}
                    <g transform={`translate(${W - 30}, ${H - 30})`} opacity="0.28">
                      <circle r="14" fill="none" stroke="#8B5E3C" strokeWidth="1" />
                      <line x1="0" y1="-10" x2="0" y2="10" stroke="#8B5E3C" strokeWidth="1.2" />
                      <line x1="-10" y1="0" x2="10" y2="0" stroke="#8B5E3C" strokeWidth="1.2" />
                      <text x="0" y="-14" textAnchor="middle" fontSize="7" fill="#8B5E3C" fontWeight="bold">N</text>
                    </g>

                    {/* Themed emoji decorations scattered around path */}
                    {decos.map((d, i) => (
                      <text
                        key={i}
                        x={d.x}
                        y={d.y}
                        fontSize={d.s}
                        textAnchor="middle"
                        dominantBaseline="central"
                        opacity="0.70"
                      >
                        {d.e}
                      </text>
                    ))}
                  </svg>

                  {/* ── HTML stop nodes absolutely positioned over SVG ── */}
                  {region.lessons.map((lesson, i) => {
                    const node = nodes[i];
                    const done = loaded && isLessonCompleted(lesson.id);
                    const isNext = nextLesson?.id === lesson.id;
                    const lessonUnlocked =
                      i === 0 ||
                      (loaded && isLessonCompleted(region.lessons[i - 1].id));
                    const icon = (REGION_ICONS[region.id] ?? [])[i] ?? "📍";
                    const displayTitle = lesson.title.replace(/^Parada:\s*/i, "");

                    return (
                      <div
                        key={lesson.id}
                        className="absolute z-10"
                        style={{
                          left: `${((node.x / W) * 100).toFixed(2)}%`,
                          top: `${((node.y / H) * 100).toFixed(2)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {lessonUnlocked ? (
                          <Link href={`/lesson/${lesson.id}`} className="group">
                            <ParadaNode done={done} isNext={isNext} title={displayTitle} icon={icon} />
                          </Link>
                        ) : (
                          <div className="opacity-50">
                            <ParadaNode done={false} isNext={false} title={displayTitle} icon={icon} locked />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {nextLesson && loaded && (
              <Link
                href={`/lesson/${nextLesson.id}`}
                className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-terracotta py-4 font-extrabold text-white shadow-md shadow-terracotta/30 active:scale-[0.98] active:shadow-sm"
              >
                <span className="nimin-pattern-top pointer-events-none absolute inset-x-0 top-0 opacity-25" />
                {completed === 0 ? "Iniciar parada" : "Siguiente parada"} →
              </Link>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function ParadaNode({
  done,
  isNext,
  title,
  icon,
  locked,
}: {
  done: boolean;
  isNext: boolean;
  title: string;
  icon: string;
  locked?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] text-2xl shadow-md transition-transform group-active:scale-95 ${
          locked
            ? "border-sand-dark bg-sand text-earth-muted"
            : done
              ? "border-sage bg-sage/20 text-sage"
              : isNext
                ? "border-terracotta bg-terracotta text-white animate-pulse-soft"
                : "border-sand-dark/60 bg-white"
        }`}
      >
        {locked ? "🔒" : icon}
      </div>
      {done && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage text-[10px] text-white shadow-sm">
          ✓
        </span>
      )}
      </div>
      <p
        className={`mt-2 max-w-[100px] text-center text-xs font-bold ${
          isNext ? "text-terracotta" : done ? "text-sage" : "text-earth-muted"
        }`}
      >
        {title}
      </p>
    </div>
  );
}
