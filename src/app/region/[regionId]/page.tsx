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

const OFFSETS = ["justify-center", "justify-start pl-6", "justify-end pr-6"] as const;

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
        className="absolute left-4 top-16 z-20 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-teal shadow"
      >
        ← Ruta
      </Link>

      <div className="relative h-48 overflow-hidden">
        <RegionLandscape kind={region.theme.landscape} className="h-full w-full" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-bold text-white/90 drop-shadow">{region.latitude}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-terracotta drop-shadow">
            {region.topic}
          </p>
          <h1 className="text-2xl font-extrabold text-charcoal drop-shadow-sm">
            {region.name}
          </h1>
          <p className="text-sm text-earth-muted">{region.subtitle}</p>
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
              Küme aún prepara las palabras de {region.topic.toLowerCase()}.
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

            <div className="relative py-4">
              <div className="absolute bottom-8 left-1/2 top-8 w-0.5 -translate-x-1/2 bg-sand-dark/40" />
              <div className="space-y-8">
                {region.lessons.map((lesson, i) => {
                  const done = loaded && isLessonCompleted(lesson.id);
                  const isNext = nextLesson?.id === lesson.id;
                  const lessonUnlocked =
                    i === 0 ||
                    (loaded && isLessonCompleted(region.lessons[i - 1].id));

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex ${OFFSETS[i % OFFSETS.length]}`}
                    >
                      {lessonUnlocked ? (
                        <Link href={`/lesson/${lesson.id}`} className="group z-10">
                          <ParadaNode done={done} isNext={isNext} title={lesson.title} />
                        </Link>
                      ) : (
                        <div className="z-10 opacity-50">
                          <ParadaNode done={false} isNext={false} title={lesson.title} locked />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {nextLesson && loaded && (
              <Link
                href={`/lesson/${nextLesson.id}`}
                className="flex w-full items-center justify-center rounded-2xl bg-terracotta py-4 font-extrabold text-white shadow-md active:scale-[0.98]"
              >
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
  locked,
}: {
  done: boolean;
  isNext: boolean;
  title: string;
  locked?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] text-2xl shadow-md transition-transform group-active:scale-95 ${
          locked
            ? "border-sand-dark bg-sand text-earth-muted"
            : done
              ? "border-sage bg-sage text-white"
              : isNext
                ? "border-terracotta bg-terracotta text-white animate-pulse-soft"
                : "border-sand-dark bg-white"
        }`}
      >
        {locked ? "🔒" : done ? "🏕️" : isNext ? "⛺" : "📍"}
      </div>
      <p
        className={`mt-2 max-w-[100px] text-center text-xs font-bold ${
          isNext ? "text-terracotta" : "text-earth-muted"
        }`}
      >
        {title}
      </p>
    </div>
  );
}
