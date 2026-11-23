# Integrity UI/UX — Guía de Diseño Oficial

Este documento define el estándar visual obligatorio para todos los proyectos web de **Integrity**. Tanto desarrolladores como agentes de IA deben seguir estas reglas para mantener coherencia entre proyectos.

## 1. Principios visuales

- **Minimalismo operativo:** superficies limpias, bordes sutiles (`1px`), jerarquía clara y cero ruido decorativo.
- **Identidad 100% Integrity:** el color primario y de foco es azul Integrity (`#273679` en claro, `#3D4F9C` en oscuro). No introducir colores de acento arbitrarios por pantalla.
- **Light & Dark de primera clase:** toda vista y componente debe funcionar en modo claro y oscuro usando las clases `dark:` y variables de `@andrescardenasintegrity/integrity-tokens/css`.
- **Densidad empresarial legible:** tablas claras con tipografía tabular (`tabular-nums`), códigos/IDs en `font-mono`, controles consistentes y estados vacíos/carga explícitos.

## 2. Tokens oficiales

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--color-accent` / `bg-accent` | `#273679` | `#3D4F9C` | Botones primarios, ítem activo en sidebar, foco |
| `--color-accent-hover` | `#1E2B61` | `#4F63B5` | Hover de acciones primarias |
| `--color-accent-light` | `#EEF1FA` | `#17214C` | Fondos suaves de realce / badges de marca |
| `--color-bg-primary` | `#FFFFFF` | `#0A0A0A` | Tarjetas, modales, paneles principales |
| `--color-bg-secondary` | `#FAFAFA` | `#141414` | Fondo general de aplicación |
| `--color-border` | `#E2E8F0` | `#27272A` | Bordes de tarjetas, tablas e inputs |
| `operational` | `#10B981` | `#10B981` | Estado saludable / éxito |
| `degraded` | `#F59E0B` | `#F59E0B` | Advertencia / degradado |
| `down` | `#EF4444` | `#EF4444` | Error / acción destructiva |
| `maintenance` | `#6366F1` | `#6366F1` | Mantenimiento / proceso en curso |

## 3. Tipografía e iconografía

- **Sans principal:** `Inter` (pesos 400, 500, 600, 700).
- **Monospace:** `JetBrains Mono` para IDs, códigos, CLABEs, HTTP status, rutas y bloques de código.
- **Iconos:** exclusivamente **Heroicons** (`i-heroicons-*` vía `@nuxt/icon`). No mezclar familias de iconos en una misma interfaz.

## 4. Layout estándar

- Toda pantalla administrativa debe montarse dentro de `IntegrityAppShell` (sidebar colapsable `16rem` / `3.5rem` + `Ctrl+B` + barra móvil superior).
- Toda página inicia con `IntegrityPageHeader` (`.page-header`, `.page-title`, `.page-subtitle`, `.page-actions`).
- Acciones destructivas requieren `useIntegrityConfirm()` con `type: 'danger'` (y `confirmDelaySeconds` si afectan datos críticos).
- Notificaciones transitorias usan `useIntegrityToast()` — nunca `window.alert()` ni `window.confirm()`.

## 5. Páginas de error y rutas no encontradas (404 / 403 / 500)

- **Nunca dejar la página de error por defecto de Nuxt/Vite:** el layer `@andrescardenasintegrity/integrity-ui-nuxt` provee `app/error.vue` conectado a `IntegrityErrorPage`, heredado automáticamente por todos los proyectos.
- **Identidad y recuperación clara:** toda pantalla de ruta no encontrada (`404`) debe mostrar la marca Integrity, el código HTTP en `font-mono` (`HTTP 404`), la ruta solicitada, soporte Light/Dark y al menos dos acciones claras (`Volver al inicio` vía `clearError({ redirect: '/' })` y `Regresar`).
- **Seguridad en producción:** nunca exponer stack traces, consultas SQL, rutas internas del servidor ni mensajes crudos de backend al usuario final (`showDetails` debe permanecer en `false` en producción).
- **Personalización:** si un proyecto requiere enlaces o textos propios, crear `app/error.vue` local envolviendo `<IntegrityErrorPage :error="error" />` y usando sus props (`home-path`, `home-label`, `title`, `description`) o el slot `#actions`.
