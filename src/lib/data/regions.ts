import type { Region } from "../types";
import { aricaSaludosLessons } from "./lessons/arica-saludos";
import { laSerenaNumerosLessons } from "./lessons/la-serena-numeros";
import { valparaisoFamiliaLessons } from "./lessons/valparaiso-familia";
import { santiagoComidaLessons } from "./lessons/santiago-comida";
import { temucoNaturalezaLessons } from "./lessons/temuco-naturaleza";
import { valdiviaAnimalesLessons } from "./lessons/valdivia-animales";
import { osornoCasaLessons } from "./lessons/osorno-casa";
import { chiloeRelatosLessons } from "./lessons/chiloe-relatos";
import { aysenClimaLessons } from "./lessons/aysen-clima";
import { puntaArenasRepasoLessons } from "./lessons/punta-arenas-repaso";

const M = {
  source: "seed" as const,
  validated: false,
  notes: "Stop placeholder — content pending",
};

/** Southbound journey: 10 city stops from Arica to Punta Arenas */
export const regions: Region[] = [
  {
    id: "arica",
    name: "Arica",
    topic: "Saludos",
    subtitle: "Donde Chile despierta con el sol del norte",
    latitude: "18° Sur",
    order: 1,
    theme: {
      landscape: "desert",
      skyFrom: "#f4a261",
      skyTo: "#e9c46a",
      accent: "#c8542a",
      culturalElement: "Morro de Arica y desierto",
      kumeWelcome:
        "Mari mari. Empezamos el viaje en Arica. Aquí aprendemos las primeras palabras del camino.",
    },
    meta: M,
    lessons: aricaSaludosLessons,
  },
  {
    id: "la-serena",
    name: "La Serena",
    topic: "Números",
    subtitle: "Valles, estrellas y viñedos",
    latitude: "29° Sur",
    order: 2,
    theme: {
      landscape: "wine",
      skyFrom: "#457b9d",
      skyTo: "#a8dadc",
      accent: "#588157",
      culturalElement: "Observatorios y elqui",
      kumeWelcome:
        "Has avanzado hacia el sur. Pronto contaremos en mapudungun bajo el cielo de La Serena.",
    },
    meta: M,
    lessons: laSerenaNumerosLessons,
  },
  {
    id: "valparaiso",
    name: "Valparaíso",
    topic: "Familia",
    subtitle: "Colores del pacífico y las laderas",
    latitude: "33° Sur",
    order: 3,
    theme: {
      landscape: "coast",
      skyFrom: "#89c2d9",
      skyTo: "#caf0f8",
      accent: "#e63946",
      culturalElement: "Ascensores y murales",
      kumeWelcome:
        "Nueva parada desbloqueada. En el puerto aprenderemos palabras de familia y hogar.",
    },
    meta: M,
    lessons: valparaisoFamiliaLessons,
  },
  {
    id: "santiago",
    name: "Santiago",
    topic: "Comida",
    subtitle: "La capital entre cordillera y valle",
    latitude: "33° Sur",
    order: 4,
    theme: {
      landscape: "city",
      skyFrom: "#adb5bd",
      skyTo: "#dee2e6",
      accent: "#c8542a",
      culturalElement: "Plaza y cordillera",
      kumeWelcome:
        "Cada palabra te acerca más al Wallmapu. En Santiago probaremos vocabulario de la mesa.",
    },
    meta: M,
    lessons: santiagoComidaLessons,
  },
  {
    id: "temuco",
    name: "Temuco",
    topic: "Naturaleza y cultura",
    subtitle: "Corazón del pueblo mapuche",
    latitude: "38° Sur",
    order: 5,
    theme: {
      landscape: "araucania",
      skyFrom: "#588157",
      skyTo: "#a3b18a",
      accent: "#344e41",
      culturalElement: "Araucarias y kultrun",
      kumeWelcome:
        "Aquí la lengua vive en cada fogón. Pudu te espera entre bosques y tradición.",
    },
    meta: M,
    lessons: temucoNaturalezaLessons,
  },
  {
    id: "valdivia",
    name: "Valdivia",
    topic: "Animales",
    subtitle: "Ríos, lluvia y selva valdiviana",
    latitude: "39° Sur",
    order: 6,
    theme: {
      landscape: "lake",
      skyFrom: "#457b9d",
      skyTo: "#89c2d9",
      accent: "#1d3557",
      culturalElement: "Río Calle-Calle",
      kumeWelcome:
        "Has avanzado hacia el sur. En Valdivia escucharemos los nombres de los animales del bosque.",
    },
    meta: M,
    lessons: valdiviaAnimalesLessons,
  },
  {
    id: "osorno",
    name: "Osorno",
    topic: "Casa y vida diaria",
    subtitle: "Volcán, lagos y campo",
    latitude: "40° Sur",
    order: 7,
    theme: {
      landscape: "volcano",
      skyFrom: "#6c757d",
      skyTo: "#adb5bd",
      accent: "#495057",
      culturalElement: "Volcán Osorno",
      kumeWelcome:
        "Nueva parada desbloqueada. Aprenderemos palabras del hogar y la vida cotidiana.",
    },
    meta: M,
    lessons: osornoCasaLessons,
  },
  {
    id: "chiloe",
    name: "Chiloé",
    topic: "Relatos y memoria",
    subtitle: "Islas, mitos y madera azul",
    latitude: "42° Sur",
    order: 8,
    theme: {
      landscape: "chiloé",
      skyFrom: "#457b9d",
      skyTo: "#a8dadc",
      accent: "#1d3557",
      culturalElement: "Palafitos y lichen",
      kumeWelcome:
        "El archipiélago guarda historias. Pudu te contará relatos en mapudungun.",
    },
    meta: M,
    lessons: chiloeRelatosLessons,
  },
  {
    id: "aysen",
    name: "Aysén",
    topic: "Clima y territorio",
    subtitle: "Fiordos, hielo y horizonte infinito",
    latitude: "45° Sur",
    order: 9,
    theme: {
      landscape: "fjord",
      skyFrom: "#495057",
      skyTo: "#6c757d",
      accent: "#48cae4",
      culturalElement: "Carretera Austral",
      kumeWelcome:
        "Cada palabra te acerca más al Wallmapu. Aquí hablamos del clima y la tierra.",
    },
    meta: M,
    lessons: aysenClimaLessons,
  },
  {
    id: "punta-arenas",
    name: "Punta Arenas",
    topic: "Repaso final",
    subtitle: "El fin del camino, el inicio de todo",
    latitude: "53° Sur",
    order: 10,
    theme: {
      landscape: "patagonia",
      skyFrom: "#6c757d",
      skyTo: "#adb5bd",
      accent: "#495057",
      culturalElement: "Estrecho de Magallanes",
      kumeWelcome:
        "Llegamos al sur profundo. Repasaremos todo lo aprendido en el viaje con Pudu.",
    },
    meta: M,
    lessons: puntaArenasRepasoLessons,
  },
];

/** Legacy region IDs → new stop IDs */
export const LEGACY_REGION_IDS: Record<string, string> = {
  atacama: "arica",
  araucania: "temuco",
  patagonia: "punta-arenas",
};

export function resolveRegionId(id: string): string {
  return LEGACY_REGION_IDS[id] ?? id;
}

export function getRegion(id: string): Region | undefined {
  return regions.find((r) => r.id === resolveRegionId(id));
}

export function getLesson(lessonId: string) {
  for (const region of regions) {
    const lesson = region.lessons.find((l) => l.id === lessonId);
    if (lesson) return { region, lesson };
  }
  return undefined;
}

export function getAllLessons() {
  return regions.flatMap((r) => r.lessons);
}

export function getNextLesson(currentLessonId: string) {
  const all = getAllLessons().sort((a, b) => {
    const regA = regions.find((r) => r.id === a.regionId)!;
    const regB = regions.find((r) => r.id === b.regionId)!;
    if (regA.order !== regB.order) return regA.order - regB.order;
    return a.order - b.order;
  });
  const idx = all.findIndex((l) => l.id === currentLessonId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
}

export function isRegionComplete(
  regionId: string,
  isLessonCompleted: (id: string) => boolean
): boolean {
  const region = getRegion(regionId);
  if (!region || region.lessons.length === 0) return false;
  return region.lessons.every((l) => isLessonCompleted(l.id));
}

/** Unlocked when the nearest prior stop with lessons is complete */
export function isRegionUnlocked(
  regionId: string,
  isLessonCompleted: (id: string) => boolean
): boolean {
  const region = getRegion(regionId);
  if (!region) return false;
  if (region.order === 1) return true;

  const priorWithLessons = [...regions]
    .filter((r) => r.order < region.order && r.lessons.length > 0)
    .sort((a, b) => b.order - a.order)[0];

  if (!priorWithLessons) return true;
  return isRegionComplete(priorWithLessons.id, isLessonCompleted);
}

export function getPlayableRegion(
  isLessonCompleted: (id: string) => boolean
): Region | undefined {
  return regions.find(
    (r) =>
      r.lessons.length > 0 &&
      isRegionUnlocked(r.id, isLessonCompleted) &&
      !isRegionComplete(r.id, isLessonCompleted)
  );
}

/** @deprecated use getRegion */
export const units = regions;
export const getUnit = getRegion;
