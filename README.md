# Mapulengua

Aprende **mapudungun** desde el español con Küme, un condor guía inspirado en la cordillera de los Andes.

## Características

- Unidades y lecciones estructuradas
- XP, rachas y vidas (corazones)
- Ejercicios: opción múltiple, emparejar, traducir ES ↔ ARN
- Seguimiento de progreso (localStorage)
- Diseño mobile-first con identidad visual andina cálida

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
  app/              # Páginas (inicio, curso, lección)
  components/       # UI, Küme, ejercicios
  lib/
    data/units.ts   # Contenido semilla (reemplazable)
    store/          # Progreso del usuario
    types.ts        # Tipos y metadatos de contenido
```

## Contenido

El contenido inicial está marcado como `source: "seed"` y `validated: false`. Está pensado para ser reemplazado o validado por hablantes expertos de mapudungun.

## Identidad visual

- **Tema único**: crema cálida, terracota, teal andino, dorado
- **Mascota**: Küme (condor original en SVG)
- Sin modo claro/oscuro
