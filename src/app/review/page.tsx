"use client";

import { AppShell } from "@/components/layout/AppShell";
import { KumeHero } from "@/components/kume/KumeHero";

export default function ReviewPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-12 text-center">
        <KumeHero emotion="thinking" animation="float" size={120} />
        <h1 className="mt-4 text-xl font-extrabold text-charcoal">Diario de viaje</h1>
        <p className="mt-2 max-w-xs text-sm text-earth-muted">
          Pronto podrás repasar las palabras que fuiste coleccionando en el camino.
        </p>
      </div>
    </AppShell>
  );
}
