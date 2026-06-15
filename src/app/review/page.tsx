"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Kume } from "@/components/kume/Kume";

export default function ReviewPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-12 text-center">
        <Kume size={100} emotion="thinking" animation="idle" />
        <h1 className="mt-4 text-xl font-extrabold text-charcoal">Diario de viaje</h1>
        <p className="mt-2 max-w-xs text-sm text-earth-muted">
          Pronto podrás repasar las palabras que fuiste coleccionando en el camino.
        </p>
      </div>
    </AppShell>
  );
}
