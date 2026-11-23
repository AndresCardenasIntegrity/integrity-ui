# Integrity UI/UX — Roadmap & Contexto de Continuación

> Documento de handoff con las decisiones acordadas y los siguientes pasos en orden para llevar **Integrity UI/UX** a `v1.0.0`.

## Estado actual (Completado)

- **Monorepo `pnpm`** creado en `C:\Users\Andres Cardenas\Documents\AXA\Repos\integrity-ui` (`pnpm@12.11.2`, Node `>=22`, `shamefullyHoist: true` en `pnpm-workspace.yaml`).
- **`@andrescardenasintegrity/integrity-tokens` (`packages/tokens`)**:
  - 100% agnóstico de framework (listo para Nuxt/Vue hoy y React en el futuro).
  - Paleta **100% Integrity** (`#273679` claro / `#3D4F9C` oscuro), sin capa de temas por cliente por ahora para evitar sobreingeniería.
  - Incluye exports duales ESM + CJS (`index.js`, `tokens.cjs`, `index.d.ts`, `tailwind.preset.js`, `tailwind.preset.cjs`), `css/theme.css` y `brand/integrity-mark.svg`.
- **`@andrescardenasintegrity/integrity-ui-nuxt` (`packages/nuxt`)**:
  - Nuxt 4 Layer con `tailwind.config.cjs` (auto-descubierto por `@nuxtjs/tailwindcss`; **no** agregar `configPath` en `nuxt.config.ts` para evitar merge circular, y mantener `.cjs` para evitar ciclos `interopDefault` en `jiti`/`klona` cuando se instala desde `node_modules` en Node 22/24) cargando `@tailwindcss/forms` y `@tailwindcss/typography`.
  - 5 composables (`useIntegrityTheme`, `useIntegritySidebar`, `useIntegrityToast`, `useIntegrityConfirm`, `useIntegritySensitive`).
  - 25 componentes base y operativos en `packages/nuxt/app/components/` (incluyendo `IntegrityPagination`, `IntegrityTabs`, `IntegrityStatCard`, `IntegritySkeleton`, `IntegrityDrawer`, `IntegrityMultiSelect` e `IntegrityEmailListInput`) y utilidades (`emailList.ts`, `pagination.ts`).
- **`@andrescardenasintegrity/integrity-showcase` (`apps/showcase`)**:
  - Portal interactivo verificando `extends: ['@andrescardenasintegrity/integrity-ui-nuxt']` con páginas `/`, `/foundations`, `/components`, `/data`, `/templates`, `/templates/dashboard` y `/templates/login`.
- **Starter de cliente (`starters/nuxt-client/`)**:
  - Plantilla mínima Nuxt 4 lista para copiar, con `.npmrc`, layout `IntegrityAppShell`, `/` (KPIs + tabla + paginación) y `/login`.
- **Tests unitarios (Vitest):**
  - 4 archivos de pruebas (17 tests) cubriendo tokens, `emailList`, `pagination` y los 5 composables, integrados en `ci.yml` y `publish.yml`.
- **Git y distribución en GitHub Packages (Paso 1 completado):**
  - Repositorio Git inicializado en `main` con `origin` apuntando a `https://github.com/AndresCardenasIntegrity/integrity-ui.git`.
  - Paquetes configurados con `publishConfig` (`https://npm.pkg.github.com`), `repository`, plantilla `.npmrc.consumer.example` y workflows `.github/workflows/ci.yml` y `.github/workflows/publish.yml` (publicación automática en tags `v*`).
  - Validados `pnpm test`, `pnpm typecheck`, `pnpm build` y `pnpm pack` en ambos paquetes.
- **Documentación base:** `README.md` y `DESIGN_SYSTEM.md` actualizados.

---

## Siguientes pasos (Ejecutar en orden)

### Paso 1 — Inicializar Git y configurar distribución en GitHub *(Completado)*
- Pendiente únicamente crear el repositorio `AndresCardenasIntegrity/integrity-ui` en GitHub y ejecutar `git push -u origin main`.

### Paso 2 — Completar la librería `v1.0.0` y el Starter de cliente *(Completado)*
- 7 componentes agregados a `@andrescardenasintegrity/integrity-ui-nuxt` y documentados en `apps/showcase`.
- Plantilla `starters/nuxt-client/` creada y tests unitarios configurados con Vitest.

### Paso 3 — Prueba real en proyecto cliente externo *(Completado)*
- Validado instalando los tarballs empaquetados de `@andrescardenasintegrity/integrity-ui-nuxt` y `@andrescardenasintegrity/integrity-tokens` en una copia aislada de `starters/nuxt-client/` fuera del monorepo (`pnpm install`, `nuxt typecheck`, `nuxt build`, SSR HTTP 200 en `/` y `/login`, fuentes `Inter`/`JetBrains Mono`, Heroicons locales y CSS Light/Dark).
- Hallazgo corregido durante la prueba: migración de `tailwind.config.js` a `tailwind.config.cjs` + exports CJS en `integrity-tokens` para evitar el ciclo `klona` de `jiti@1.21.7` al cargar capas ESM desde `node_modules` bajo Node 24.

### Paso 4 — Deploy estático del Showcase *(Completado)*
- Configurado `apps/showcase/nuxt.config.ts` con `app.baseURL` dinámico (`NUXT_APP_BASE_URL`), `nitro.prerender` para las 7 rutas, `icon.clientBundle.scan: true` (45 Heroicons embebidos offline) y `apps/showcase/public/.nojekyll`.
- Creado el workflow `.github/workflows/deploy-showcase.yml` para GitHub Pages (detección automática de `base_path` + `workflow_dispatch`) y documentada la salida estática `apps/showcase/.output/public/` para VPS/Nginx.
- Validado `nuxt generate` tanto para subpath `/integrity-ui/` como para raíz `/`.
