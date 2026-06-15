"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Kume } from "@/components/kume/Kume";

export default function LeaguesPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-12 text-center">
        <Kume size={100} mood="celebrating" />
        <h1 className="mt-4 text-xl font-extrabold text-charcoal">Ligas</h1>
        <p className="mt-2 max-w-xs text-sm text-earth-muted">
          Compite con otros aprendices de mapudungun. Próximamente.
        </p>
      </div>
    </AppShell>
  );
}
