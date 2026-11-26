# Integrity Nuxt 4 Client Starter

Plantilla mínima lista para copiar y arrancar un nuevo proyecto web sobre `@integritysoftwarela/integrity-ui-nuxt`.

## Uso rápido

1. Copia esta carpeta (`starters/nuxt-client`) a la ubicación del nuevo proyecto y ajusta `name` en `package.json`.
2. Instala dependencias y levanta el servidor de desarrollo (los paquetes `@integritysoftwarela/*` son públicos en npm, no requieren token):

```bash
pnpm install
pnpm dev
```

## Qué incluye por defecto

- Conexión al Nuxt 4 Layer `@integritysoftwarela/integrity-ui-nuxt` en `nuxt.config.ts`.
- Contenedores globales `<IntegrityToastContainer />` y `<IntegrityConfirmDialog />` en `app/app.vue`.
- Layout administrativo con `<IntegrityAppShell />` (`app/layouts/default.vue`).
- Pantallas base `/` (KPIs + tabla + paginación) y `/login`.
- Fuentes `Inter` y `JetBrains Mono`, Heroicons locales y soporte Light/Dark automático.

## Skill de IA recomendada

Para que tu agente (Antigravity, Claude Code, Cursor, Codex) conozca los 32 componentes, composables y reglas visuales de Integrity UI/UX, copia `.agents/skills/integrity-ui/` desde el repositorio `integrity-ui` a `.agents/skills/integrity-ui/` en este proyecto o ejecuta:

```bash
npx skills add IntegritySoftwareLA/integrity-ui
```

