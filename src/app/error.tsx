"use client";

import Link from "next/link";
import { useEffect } from "react";
import { KumeHero } from "@/components/kume/KumeHero";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <KumeHero emotion="sad" animation="float" size={160} className="mb-4" />

      <h1 className="text-xl font-extrabold text-charcoal">Algo salió mal</h1>
      <p className="mt-1 max-w-xs text-sm text-earth-muted">
        Pudu encontró un error en el camino. Podemos intentarlo de nuevo.
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-2xl bg-terracotta px-6 py-3 font-extrabold text-white shadow-md shadow-terracotta/25 active:scale-95"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-2xl border-2 border-sand-dark bg-white px-6 py-3 font-extrabold text-charcoal active:scale-95"
        >
          Inicio
        </Link>
      </div>
    </div>
  );
}
