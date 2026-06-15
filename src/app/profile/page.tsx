"use client";

import { AppShell } from "@/components/layout/AppShell";
import { XpBar } from "@/components/ui/Stats";
import { Kume } from "@/components/kume/Kume";
import { regions } from "@/lib/data/regions";
import { useProgress } from "@/lib/store/progress";

export default function ProfilePage() {
  const { progress, loaded, isLessonCompleted } = useProgress();

  const regionsVisited = regions.filter((r) =>
    r.lessons.some((l) => isLessonCompleted(l.id))
  ).length;

  return (
    <AppShell>
      <div className="py-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <Kume size={128} emotion="proud" animation="idle" className="mb-3" />
          <h1 className="text-xl font-extrabold text-charcoal">Tu mochila</h1>
          <p className="text-sm text-earth-muted">Viajero del mapudungun</p>
        </div>

        {loaded && (
          <div className="space-y-4 rounded-2xl border-2 border-sand-dark bg-white p-4">
            <XpBar xp={progress.xp} />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-sand/60 py-3">
                <p className="text-lg font-extrabold text-charcoal">{progress.xp}</p>
                <p className="text-[11px] font-semibold text-earth-muted">Recuerdos</p>
              </div>
              <div className="rounded-xl bg-sand/60 py-3">
                <p className="text-lg font-extrabold text-charcoal">{progress.streak}</p>
                <p className="text-[11px] font-semibold text-earth-muted">Días</p>
              </div>
              <div className="rounded-xl bg-sand/60 py-3">
                <p className="text-lg font-extrabold text-charcoal">{regionsVisited}</p>
                <p className="text-[11px] font-semibold text-earth-muted">Regiones</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
