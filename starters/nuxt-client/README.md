# Integrity Nuxt 4 Client Starter

Plantilla mínima lista para copiar y arrancar un nuevo proyecto web sobre `@andrescardenasintegrity/integrity-ui-nuxt`.

## Uso rápido

1. Copia esta carpeta (`starters/nuxt-client`) a la ubicación del nuevo proyecto y ajusta `name` en `package.json`.
2. Exporta tu token de GitHub con permiso `read:packages`:

```bash
# PowerShell
$env:NODE_AUTH_TOKEN = "ghp_tu_token"

# Bash / Zsh
export NODE_AUTH_TOKEN="ghp_tu_token"
```

3. Instala dependencias y levanta el servidor de desarrollo:

```bash
pnpm install
pnpm dev
```

## Qué incluye por defecto

- Conexión al Nuxt 4 Layer `@andrescardenasintegrity/integrity-ui-nuxt` en `nuxt.config.ts`.
- Contenedores globales `<IntegrityToastContainer />` y `<IntegrityConfirmDialog />` en `app/app.vue`.
- Layout administrativo con `<IntegrityAppShell />` (`app/layouts/default.vue`).
- Pantallas base `/` (KPIs + tabla + paginación) y `/login`.
- Fuentes `Inter` y `JetBrains Mono`, Heroicons locales y soporte Light/Dark automático.

## Skill de IA recomendada

Para que tu agente (Antigravity, Claude Code, Cursor, Codex) conozca los 28 componentes, composables y reglas visuales de Integrity UI/UX, copia `.agents/skills/integrity-ui/` desde el repositorio `integrity-ui` a `.agents/skills/integrity-ui/` en este proyecto o ejecuta:

```bash
npx skills add AndresCardenasIntegrity/integrity-ui
```

