"use client";

import { AppShell } from "@/components/layout/AppShell";
import { KumeHero } from "@/components/kume/KumeHero";

export default function LeaguesPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-12 text-center">
        <KumeHero emotion="celebrating" animation="celebrate" size={120} />
        <h1 className="mt-4 text-xl font-extrabold text-charcoal">Huellas del camino</h1>
        <p className="mt-2 max-w-xs text-sm text-earth-muted">
          Comparte tu ruta con otros viajeros del mapudungun. Próximamente.
        </p>
      </div>
    </AppShell>
  );
}
