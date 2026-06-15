import type { Unit } from "../types";

const SEED_META = {
  source: "seed" as const,
  validated: false,
  notes: "Initial seed content — pending expert review",
};

export const units: Unit[] = [
  {
    id: "greetings",
    title: "Saludos y presentaciones",
    titleMapudungun: "Kümeelün",
    description: "Aprende a saludar y presentarte en mapudungun.",
    order: 1,
    icon: "👋",
    color: "terracotta",
    meta: SEED_META,
    lessons: [
      {
        id: "greetings-1",
        unitId: "greetings",
        title: "Hola y adiós",
        description: "Saludos básicos del día a día.",
        order: 1,
        xpReward: 10,
        meta: SEED_META,
        exercises: [
          {
            type: "multiple-choice",
            id: "g1-e1",
            prompt: "¿Cómo se dice «Hola» en mapudungun?",
            promptLang: "es",
            options: ["Mari mari", "Adkintun", "Petu", "Küme"],
            correctIndex: 0,
            explanation: "«Mari mari» es el saludo tradicional mapuche, usado para decir hola.",
            meta: SEED_META,
          },
          {
            type: "multiple-choice",
            id: "g1-e2",
            prompt: "¿Qué significa «Adkintun»?",
            promptLang: "arn",
            options: ["Hasta luego", "Buenos días", "Gracias", "Adiós"],
            correctIndex: 3,
            explanation: "«Adkintun» se usa para despedirse.",
            meta: SEED_META,
          },
          {
            type: "translate-to-mapudungun",
            id: "g1-e3",
            prompt: "Buenos días",
            acceptedAnswers: ["Mari mari", "mari mari", "Mari Mari"],
            hint: "Usa el saludo tradicional mapuche.",
            explanation: "«Mari mari» también puede usarse como saludo matutino.",
            meta: SEED_META,
          },
          {
            type: "translate-to-spanish",
            id: "g1-e4",
            prompt: "Petu",
            acceptedAnswers: ["Hasta pronto", "hasta pronto", "Nos vemos pronto", "nos vemos pronto"],
            hint: "Es una despedida informal.",
            explanation: "«Petu» significa hasta pronto o nos vemos.",
            meta: SEED_META,
          },
        ],
      },
      {
        id: "greetings-2",
        unitId: "greetings",
        title: "Bienvenida",
        description: "Palabras de bienvenida y cortesía.",
        order: 2,
        xpReward: 10,
        meta: SEED_META,
        exercises: [
          {
            type: "multiple-choice",
            id: "g2-e1",
            prompt: "¿Cómo se dice «Bienvenido/a» en mapudungun?",
            promptLang: "es",
            options: ["Küme ta iñche", "Mari mari", "Amulepe", "Welu"],
            correctIndex: 0,
            explanation: "«Küme ta iñche» expresa una bienvenida cálida.",
            meta: SEED_META,
          },
          {
            type: "matching",
            id: "g2-e2",
            instruction: "Une cada palabra en español con su traducción en mapudungun.",
            pairs: [
              { id: "p1", left: "Gracias", right: "Amulepe" },
              { id: "p2", left: "Por favor", right: "Welu" },
              { id: "p3", left: "Sí", right: "Mari" },
              { id: "p4", left: "No", right: "Lah" },
            ],
            meta: SEED_META,
          },
          {
            type: "translate-to-mapudungun",
            id: "g2-e3",
            prompt: "Gracias",
            acceptedAnswers: ["Amulepe", "amulepe"],
            hint: "Palabra de cortesía común.",
            meta: SEED_META,
          },
          {
            type: "translate-to-spanish",
            id: "g2-e4",
            prompt: "Welu",
            acceptedAnswers: ["Por favor", "por favor"],
            meta: SEED_META,
          },
        ],
      },
      {
        id: "greetings-3",
        unitId: "greetings",
        title: "Presentarse",
        description: "Di tu nombre y pregunta cómo está alguien.",
        order: 3,
        xpReward: 15,
        meta: SEED_META,
        exercises: [
          {
            type: "multiple-choice",
            id: "g3-e1",
            prompt: "¿Cómo se dice «Me llamo…» en mapudungun?",
            promptLang: "es",
            options: ["Iney ta iñche", "Küme ta iñche", "Mari ta iñche", "Petu ta iñche"],
            correctIndex: 0,
            explanation: "«Iney ta iñche» se usa para presentarse.",
            meta: SEED_META,
          },
          {
            type: "multiple-choice",
            id: "g3-e2",
            prompt: "¿Qué significa «Küme ta iñche»?",
            promptLang: "arn",
            options: ["Me llamo", "Estoy bien", "Bienvenido", "Hasta luego"],
            correctIndex: 1,
            explanation: "«Küme» significa bueno/bien; «iñche» es yo.",
            meta: SEED_META,
          },
          {
            type: "matching",
            id: "g3-e3",
            instruction: "Empareja las frases de presentación.",
            pairs: [
              { id: "p1", left: "¿Cómo estás?", right: "¿Küme ta iñche?" },
              { id: "p2", left: "Estoy bien", right: "Küme ta iñche" },
              { id: "p3", left: "Me llamo Ana", right: "Ana ta iñche" },
              { id: "p4", left: "¿Y tú?", right: "¿Eymi?" },
            ],
            meta: SEED_META,
          },
          {
            type: "translate-to-mapudungun",
            id: "g3-e4",
            prompt: "¿Cómo estás?",
            acceptedAnswers: ["¿Küme ta iñche?", "Küme ta iñche?", "küme ta iñche?"],
            hint: "«Küme» = bien, «iñche» = yo/tú según contexto.",
            meta: SEED_META,
          },
          {
            type: "translate-to-spanish",
            id: "g3-e5",
            prompt: "¿Eymi?",
            acceptedAnswers: ["¿Y tú?", "y tú?", "¿Y tu?", "y tu?"],
            explanation: "«Eymi» es la forma de decir «tú» en mapudungun.",
            meta: SEED_META,
          },
        ],
      },
    ],
  },
];

export function getUnit(id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function getLesson(lessonId: string) {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return undefined;
}

export function getAllLessons() {
  return units.flatMap((u) => u.lessons);
}

export function getNextLesson(currentLessonId: string) {
  const all = getAllLessons().sort((a, b) => {
    const unitA = units.find((u) => u.id === a.unitId)!;
    const unitB = units.find((u) => u.id === b.unitId)!;
    if (unitA.order !== unitB.order) return unitA.order - unitB.order;
    return a.order - b.order;
  });
  const idx = all.findIndex((l) => l.id === currentLessonId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
}
