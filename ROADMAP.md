# Integrity UI/UX — Roadmap & Contexto de Continuación

> Documento de handoff con las decisiones acordadas y los siguientes pasos en orden para llevar **Integrity UI/UX** a `v1.0.0`.

## Estado actual (Completado)

- **Monorepo `pnpm`** creado en `C:\Users\Andres Cardenas\Documents\AXA\Repos\integrity-ui` (`pnpm@12.11.2`, Node `>=22`, `shamefullyHoist: true` en `pnpm-workspace.yaml`).
- **`@andrescardenasintegrity/integrity-tokens` (`packages/tokens`)**:
  - 100% agnóstico de framework (listo para Nuxt/Vue hoy y React en el futuro).
  - Paleta **100% Integrity** (`#273679` claro / `#3D4F9C` oscuro), sin capa de temas por cliente por ahora para evitar sobreingeniería.
  - Incluye `index.js`, `index.d.ts`, `css/theme.css`, `tailwind.preset.js` (cero dependencias) y `brand/integrity-mark.svg`.
- **`@andrescardenasintegrity/integrity-ui-nuxt` (`packages/nuxt`)**:
  - Nuxt 4 Layer con `tailwind.config.js` (auto-descubierto por `@nuxtjs/tailwindcss`; **no** agregar `configPath` en `nuxt.config.ts` para evitar merge circular en capas) cargando `@tailwindcss/forms` y `@tailwindcss/typography` vía `createRequire`.
  - 5 composables (`useIntegrityTheme`, `useIntegritySidebar`, `useIntegrityToast`, `useIntegrityConfirm`, `useIntegritySensitive`).
  - 18 componentes base y operativos en `packages/nuxt/app/components/`.
- **`@andrescardenasintegrity/integrity-showcase` (`apps/showcase`)**:
  - Portal interactivo verificando `extends: ['@andrescardenasintegrity/integrity-ui-nuxt']` con páginas `/`, `/foundations`, `/components`, `/data`, `/templates`, `/templates/dashboard` y `/templates/login`.
- **Git y distribución en GitHub Packages (Paso 1 completado):**
  - Repositorio Git inicializado en `main` con `origin` apuntando a `https://github.com/AndresCardenasIntegrity/integrity-ui.git`.
  - Paquetes configurados con `publishConfig` (`https://npm.pkg.github.com`), `repository`, plantilla `.npmrc.consumer.example` y workflows `.github/workflows/ci.yml` y `.github/workflows/publish.yml` (publicación automática en tags `v*`).
  - Validados `pnpm typecheck`, `pnpm build` y `pnpm pack` en ambos paquetes.
- **Documentación base:** `README.md` y `DESIGN_SYSTEM.md` actualizados.

---

## Siguientes pasos (Ejecutar en orden)

### Paso 1 — Inicializar Git y configurar distribución en GitHub *(Completado)*
- Pendiente únicamente crear el repositorio `AndresCardenasIntegrity/integrity-ui` en GitHub y ejecutar `git push -u origin main`.

### Paso 2 — Completar la librería `v1.0.0` y el Starter de cliente
- Componentes pendientes por agregar a `@andrescardenasintegrity/integrity-ui-nuxt` y documentar en `apps/showcase`:
  - `IntegrityPagination` (paginación + `.page-size-select`)
  - `IntegrityTabs`
  - `IntegrityStatCard`
  - `IntegritySkeleton`
  - `IntegrityDrawer`
  - `IntegrityMultiSelect` (inspirado en `DirectoryUserMultiSelect.vue` del repo hermano `dashboard`, sin lógica de negocio AXA)
  - `IntegrityEmailListInput` (inspirado en `EmailSemicolonEditor.vue` + `emailValidation.ts` del repo hermano `dashboard`)
- Crear `starters/nuxt-client/` (plantilla mínima Nuxt 4 ya conectada a `@andrescardenasintegrity/integrity-ui-nuxt` para arrancar proyectos de nuevos clientes en minutos).
- Agregar tests unitarios básicos con Vitest para composables y utilidades.

### Paso 3 — Prueba real en proyecto cliente externo
- Validar la instalación y compilación de `@andrescardenasintegrity/integrity-ui-nuxt` desde un proyecto Nuxt 4 fuera del monorepo (`pnpm build`, fuentes Inter/JetBrains Mono, Heroicons locales, Light/Dark y componentes).

### Paso 4 — Deploy estático del Showcase
- Configurar `pnpm generate` y workflow (GitHub Pages o salida estática para VPS) para que todo el equipo consulte **Integrity UI/UX** por URL.
