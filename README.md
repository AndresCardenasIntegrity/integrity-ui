# Integrity UI/UX

Sistema de diseño corporativo, tokens visuales, **Nuxt 4 Layer** reutilizable y **Showcase interactivo** para estandarizar la interfaz de todos los proyectos de Integrity.

## Arquitectura del monorepo

```text
integrity-ui/
├── packages/
│   ├── tokens/               # @andrescardenasintegrity/integrity-tokens — CSS variables, Tailwind preset y marca (agnóstico: Nuxt, Vue, futuro React)
│   └── nuxt/                 # @andrescardenasintegrity/integrity-ui-nuxt — Nuxt 4 Layer con componentes y composables Vue 3
├── apps/
│   └── showcase/             # @andrescardenasintegrity/integrity-showcase — Portal web interactivo de documentación, componentes y templates
├── .github/workflows/        # CI (ci.yml) y publicación automática a GitHub Packages (publish.yml)
├── .npmrc.consumer.example   # Plantilla .npmrc para proyectos cliente
└── DESIGN_SYSTEM.md          # Reglas visuales oficiales para desarrolladores y agentes de IA
```

## Desarrollo local

Requisitos: **Node.js >= 22** y **pnpm** (`12.11.2`).

```bash
pnpm install
pnpm dev
```

Abre `http://127.0.0.1:3000` para explorar el portal **Integrity UI/UX Showcase**.

## Distribución en GitHub Packages

Los paquetes se publican automáticamente en **GitHub Packages** (`https://npm.pkg.github.com`) al crear y subir un tag `v*` (por ejemplo, `v1.0.0`) que coincida con la versión de `packages/tokens/package.json` y `packages/nuxt/package.json`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

También puedes validar la publicación en modo `dry-run` desde **Actions → Publish Packages to GitHub Packages → Run workflow**.

## Cómo usar en un nuevo proyecto Nuxt 4

1. Crea un archivo `.npmrc` en la raíz del proyecto cliente (puedes copiar [`.npmrc.consumer.example`](./.npmrc.consumer.example)):

```ini
@andrescardenasintegrity:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

2. Exporta tu token de GitHub con permiso `read:packages` en tu entorno local o CI (`NODE_AUTH_TOKEN`) e instala el layer:

```bash
pnpm add @andrescardenasintegrity/integrity-ui-nuxt
```

3. Extiende el layer en `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
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
pnpm add @andrescardenasintegrity/integrity-tokens
```

2. Importa `@andrescardenasintegrity/integrity-tokens/css` en el punto de entrada CSS y extiende el preset en `tailwind.config.js`:

```js
import integrityPreset from '@andrescardenasintegrity/integrity-tokens/preset'

export default {
  presets: [integrityPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```
