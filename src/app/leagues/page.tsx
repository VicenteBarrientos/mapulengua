"use client";

import { AppShell } from "@/components/layout/AppShell";
import { KumeHero } from "@/components/kume/KumeHero";
import { useProgress } from "@/lib/store/progress";

const TIERS = [
  {
    min: 0,
    label: "Viajero curioso",
    description: "El primer paso del camino",
    color: "text-earth-muted",
    bg: "bg-sand/60",
    border: "border-sand-dark/30",
    bar: "from-sand-dark to-sand-dark",
  },
  {
    min: 50,
    label: "Caminante del norte",
    description: "El desierto abre el viaje",
    color: "text-terracotta",
    bg: "bg-terracotta/8",
    border: "border-terracotta/30",
    bar: "from-terracotta to-coral",
  },
  {
    min: 150,
    label: "Explorador andino",
    description: "Los cerros ya te conocen",
    color: "text-teal",
    bg: "bg-teal/8",
    border: "border-teal/30",
    bar: "from-teal to-sage",
  },
  {
    min: 300,
    label: "Guardián del camino",
    description: "Palabra a palabra, el sur se acerca",
    color: "text-gem",
    bg: "bg-gem/8",
    border: "border-gem/30",
    bar: "from-gem to-teal",
  },
  {
    min: 500,
    label: "Voz del Wallmapu",
    description: "La lengua vive en tu camino",
    color: "text-gold",
    bg: "bg-gold/10",
    border: "border-gold/40",
    bar: "from-gold to-gem",
  },
] as const;

function getTierIndex(weeklyXp: number) {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (weeklyXp >= TIERS[i].min) idx = i;
  }
  return idx;
}

export default function LeaguesPage() {
  const { progress, loaded } = useProgress();
  const tierIdx = getTierIndex(progress.weeklyXp);
  const current = TIERS[tierIdx];
  const next = TIERS[tierIdx + 1] ?? null;

  const progressPct = next
    ? Math.min(100, ((progress.weeklyXp - current.min) / (next.min - current.min)) * 100)
    : 100;

  return (
    <AppShell>
      <div className="py-6 space-y-5">

        {/* Header */}
        <div className="flex flex-col items-center text-center px-4">
          <KumeHero
            emotion={tierIdx >= 4 ? "celebrating" : tierIdx >= 2 ? "proud" : "happy"}
            animation={tierIdx >= 4 ? "celebrate" : "float"}
            size={100}
          />
          <h1 className="mt-3 text-xl font-extrabold text-charcoal">Huellas del camino</h1>
          <p className="mt-1 text-sm text-earth-muted">Tu progreso personal esta semana</p>
        </div>

        {loaded && (
          <>
            {/* Current tier card */}
            <div className={`mx-4 overflow-hidden rounded-2xl border ${current.border} ${current.bg} shadow-sm`}>
              <div className={`h-1.5 w-full bg-gradient-to-r ${current.bar}`} />
              <div className="px-5 py-5 text-center">
                <p className={`text-2xl font-extrabold ${current.color}`}>{current.label}</p>
                <p className="mt-1 text-xs text-earth-muted">{current.description}</p>
                <div className="mt-4 flex justify-center gap-6 text-center">
                  <div>
                    <p className="text-2xl font-extrabold text-charcoal">{progress.weeklyXp}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-earth-muted">XP esta semana</p>
                  </div>
                  <div className="w-px bg-sand-dark/30" />
                  <div>
                    <p className="text-2xl font-extrabold text-charcoal">{progress.streak}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-earth-muted">Días seguidos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress to next tier */}
            {next && (
              <div className="mx-4 rounded-2xl border border-sand-dark/20 bg-white/60 px-4 py-4">
                <div className="flex justify-between text-xs font-bold text-earth-muted mb-2">
                  <span>{current.label}</span>
                  <span>{next.label}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-sand">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${current.bar} transition-all duration-700`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-earth-muted text-center">
                  {next.min - progress.weeklyXp} XP para {next.label}
                </p>
              </div>
            )}

            {/* All tiers as a roadmap */}
            <div className="mx-4">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-earth-muted">
                Rangos del viaje
              </p>
              <div className="space-y-2">
                {TIERS.map((tier, i) => {
                  const reached = i <= tierIdx;
                  const isCurrent = i === tierIdx;
                  return (
                    <div
                      key={tier.label}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                        isCurrent
                          ? `${tier.border} ${tier.bg}`
                          : reached
                          ? "border-sand-dark/20 bg-white/40"
                          : "border-sand-dark/15 bg-sand/20 opacity-50"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                          reached ? `${tier.bg} ${tier.color} border ${tier.border}` : "bg-sand/60 text-earth-muted border border-sand-dark/20"
                        }`}
                      >
                        {reached ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-extrabold ${isCurrent ? tier.color : reached ? "text-charcoal" : "text-earth-muted"}`}>
                          {tier.label}
                        </p>
                        <p className="text-[11px] text-earth-muted">{tier.min} XP · {tier.description}</p>
                      </div>
                      {isCurrent && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${tier.bg} ${tier.color} border ${tier.border}`}>
                          Aquí
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {tierIdx >= TIERS.length - 1 && (
              <div className="mx-4 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-center">
                <p className="font-extrabold text-charcoal">Rango máximo alcanzado</p>
                <p className="mt-1 text-sm text-earth-muted">
                  Has llegado al corazón del Wallmapu. Pudu está muy orgulloso.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
