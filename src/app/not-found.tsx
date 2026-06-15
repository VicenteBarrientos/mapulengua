"use client";

import Link from "next/link";
import { KumeHero } from "@/components/kume/KumeHero";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <KumeHero emotion="thinking" animation="float" size={160} className="mb-4" />

      <p className="text-6xl font-black text-terracotta">404</p>
      <h1 className="mt-2 text-xl font-extrabold text-charcoal">
        Pudu se perdió en el camino
      </h1>
      <p className="mt-1 max-w-xs text-sm text-earth-muted">
        Esta parada no existe en la ruta. Quizás fue movida o el camino cambió.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-2xl bg-terracotta px-8 py-3.5 font-extrabold text-white shadow-md shadow-terracotta/25 active:scale-95"
      >
        Volver a la ruta →
      </Link>
    </div>
  );
}
