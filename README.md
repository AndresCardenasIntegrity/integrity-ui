# Integrity UI/UX

Sistema de diseño corporativo, tokens visuales, **Nuxt 4 Layer** reutilizable y **Showcase interactivo** para estandarizar la interfaz de todos los proyectos de Integrity.

## Arquitectura del monorepo

```text
integrity-ui/
├── packages/
│   ├── tokens/               # @integritysoftwarela/integrity-tokens — CSS variables, Tailwind preset y marca (agnóstico: Nuxt, Vue, futuro React)
│   └── nuxt/                 # @integritysoftwarela/integrity-ui-nuxt — Nuxt 4 Layer con componentes y composables Vue 3
├── apps/
│   └── showcase/             # @integritysoftwarela/integrity-showcase — Portal web interactivo de documentación, componentes y templates
├── starters/
│   └── nuxt-client/          # Plantilla mínima Nuxt 4 lista para copiar en proyectos de nuevos clientes
├── .agents/skills/
│   └── integrity-ui/         # Skill oficial para agentes de IA (Antigravity, Claude Code, Cursor, Codex)
├── .github/workflows/        # CI (ci.yml), publicación a GitHub Packages (publish.yml) y deploy del Showcase (deploy-showcase.yml)
├── .npmrc.consumer.example   # Plantilla .npmrc para proyectos cliente
└── DESIGN_SYSTEM.md          # Reglas visuales oficiales para desarrolladores y agentes de IA
```

## Desarrollo local

Requisitos: **Node.js >= 22** y **pnpm** (`12.11.2`).

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

Abre `http://127.0.0.1:3000` para explorar el portal **Integrity UI/UX Showcase**.

## Distribución en GitHub Packages

Los paquetes se publican automáticamente en **GitHub Packages** (`https://npm.pkg.github.com`) al crear y subir un tag `v*` (por ejemplo, `v1.0.0`) que coincida con la versión de `packages/tokens/package.json` y `packages/nuxt/package.json`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

También puedes validar la publicación en modo `dry-run` desde **Actions → Publish Packages to GitHub Packages → Run workflow**.

## Deploy estático del Showcase

El portal interactivo `apps/showcase` está configurado para exportación estática completa (`nuxt generate`) con las 7 rutas pre-renderizadas, fuentes locales y los 45 Heroicons incrustados en el bundle de cliente:

- **GitHub Pages (automático):** el workflow [`.github/workflows/deploy-showcase.yml`](./.github/workflows/deploy-showcase.yml) se ejecuta en cada `push` a `main`, detecta automáticamente el `base_path` (`/integrity-ui/` o `/` si usas dominio propio) e incluye `.nojekyll`. Solo habilita **Settings → Pages → Source: GitHub Actions** en el repositorio.
- **VPS / Nginx (salida estática):** ejecuta `pnpm generate` (con `NUXT_APP_BASE_URL=/` por defecto) y sirve la carpeta `apps/showcase/.output/public/` directamente desde Nginx/Caddy.

## Cómo usar en un nuevo proyecto Nuxt 4

1. Crea un archivo `.npmrc` en la raíz del proyecto cliente (puedes copiar [`.npmrc.consumer.example`](./.npmrc.consumer.example)):

```ini
@integritysoftwarela:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

2. Exporta tu token de GitHub con permiso `read:packages` en tu entorno local o CI (`NODE_AUTH_TOKEN`) e instala el layer:

```bash
pnpm add @integritysoftwarela/integrity-ui-nuxt
```

3. Extiende el layer en `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@integritysoftwarela/integrity-ui-nuxt'],
})
```

4. Monta los contenedores globales en `app/app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <IntegrityToastContainer />
  <IntegrityConfirmDialog />
</template>
```

## Cómo usar tokens en un futuro proyecto React

1. Configura `.npmrc` como arriba e instala los tokens:

```bash
pnpm add @integritysoftwarela/integrity-tokens
```

2. Importa `@integritysoftwarela/integrity-tokens/css` en el punto de entrada CSS y extiende el preset en `tailwind.config.js`:

```js
import integrityPreset from '@integritysoftwarela/integrity-tokens/preset'

export default {
  presets: [integrityPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

## Skill oficial para Agentes de IA (`integrity-ui`)

El repositorio incluye la skill completa en [`.agents/skills/integrity-ui/`](./.agents/skills/integrity-ui/SKILL.md) con el inventario y referencia exacta de los **28 componentes** (incluyendo Combobox, `IntegrityCodeBlock`, `IntegrityMarkdown` e `IntegrityTerminalLog` para PM2), **5 composables**, **5 utilidades**, tokens y patrones de página.

### Cómo agregar la skill a tu agente

- **En un proyecto (recomendado para todo el equipo):** copia `.agents/skills/integrity-ui/` a `<tu-proyecto>/.agents/skills/integrity-ui/` (autodescubierta por Antigravity, Cursor, Codex y agentes compatibles) o instálala con:

```bash
npx skills add IntegritySoftwareLA/integrity-ui
```

- **Global en tu máquina (Antigravity):** copia `.agents/skills/integrity-ui/` en `~/.gemini/config/skills/integrity-ui/` (Windows: `%USERPROFILE%\.gemini\config\skills\integrity-ui\`).

