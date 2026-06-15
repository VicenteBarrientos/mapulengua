"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Kume } from "@/components/kume/Kume";

export default function ReviewPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-12 text-center">
        <Kume size={100} mood="thinking" />
        <h1 className="mt-4 text-xl font-extrabold text-charcoal">Repasar</h1>
        <p className="mt-2 max-w-xs text-sm text-earth-muted">
          Pronto podrás repasar lecciones completadas con Küme.
        </p>
      </div>
    </AppShell>
  );
}
