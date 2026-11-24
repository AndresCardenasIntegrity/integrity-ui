<script setup lang="ts">
withDefaults(defineProps<{
  show?: boolean
  label?: string
  environment?: string
  size?: 'md' | 'lg'
}>(), {
  show: false,
  label: 'Cambiando de entorno…',
  environment: undefined,
  size: 'lg',
})
</script>

<template>
  <Teleport to="body">
    <Transition name="integrity-env-overlay">
      <div
        v-if="show"
        class="fixed inset-0 z-[20000] flex items-center justify-center bg-[#f8fafc]/92 dark:bg-[#09090b]/92 backdrop-blur-md px-6"
        role="alertdialog"
        aria-live="assertive"
        aria-busy="true"
        :aria-label="label"
      >
        <div class="integrity-env-card flex flex-col items-center justify-center gap-6 px-8 py-6">
          <div
            class="relative"
            :class="size === 'lg' ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20'"
            aria-hidden="true"
          >
            <div class="integrity-env-loader__glow" />
            <svg
              class="relative z-10 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1080 1080"
              fill="none"
            >
              <g transform="translate(540 540) scale(0.78) translate(-540 -540)">
                <g>
                  <path
                    class="integrity-env-loader__fill integrity-env-loader__fill--a"
                    d="M62.663 212.634 L616.128 212.634 L616.128 766.099 L62.663 766.099 Z"
                  />
                  <path
                    class="integrity-env-loader__fill integrity-env-loader__fill--b"
                    d="M465.872 465.735 L1019.337 465.735 L1019.337 1019.2 L465.872 1019.2 Z"
                  />
                  <path
                    class="integrity-env-loader__fill integrity-env-loader__fill--c"
                    d="M212.6 62.8 L766.065 62.8 L766.065 616.265 L212.6 616.265 Z"
                  />
                </g>
                <path
                  class="integrity-env-loader__stroke integrity-env-loader__stroke--a"
                  d="M62.663 212.634 L616.128 212.634 L616.128 766.099 L62.663 766.099 Z"
                />
                <path
                  class="integrity-env-loader__stroke integrity-env-loader__stroke--b"
                  d="M465.872 465.735 L1019.337 465.735 L1019.337 1019.2 L465.872 1019.2 Z"
                />
                <path
                  class="integrity-env-loader__stroke integrity-env-loader__stroke--c"
                  d="M212.6 62.8 L766.065 62.8 L766.065 616.265 L212.6 616.265 Z"
                />
              </g>
            </svg>
          </div>

          <div class="flex flex-col items-center gap-2 text-center">
            <IntegrityBadge v-if="environment" tone="brand" dot size="md">
              {{ environment }}
            </IntegrityBadge>
            <p class="integrity-env-loader__label text-sm font-medium text-slate-600 dark:text-zinc-300 tracking-wide">
              {{ label }}
            </p>
            <div class="flex gap-1.5 pt-0.5" aria-hidden="true">
              <span class="integrity-env-loader__dot" />
              <span class="integrity-env-loader__dot" />
              <span class="integrity-env-loader__dot" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.integrity-env-overlay-enter-active,
.integrity-env-overlay-leave-active {
  transition: opacity 0.22s ease;
}

.integrity-env-overlay-enter-from,
.integrity-env-overlay-leave-to {
  opacity: 0;
}

.integrity-env-card {
  animation: integrity-env-card-in 0.35s ease-out;
}

.integrity-env-loader__glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-accent) 32%, transparent) 0%,
    transparent 68%
  );
  filter: blur(12px);
  animation: integrity-env-glow 2.8s ease-in-out infinite;
}

.integrity-env-loader__fill {
  fill: var(--color-accent);
  opacity: 0;
  animation: integrity-env-fill 2.8s ease-in-out infinite;
}

.integrity-env-loader__fill--a {
  animation-delay: 0.55s;
}

.integrity-env-loader__fill--b {
  animation-delay: 0.75s;
  fill: color-mix(in srgb, var(--color-accent) 78%, #38bdf8);
}

.integrity-env-loader__fill--c {
  animation-delay: 0.95s;
  fill: color-mix(in srgb, var(--color-accent) 62%, #64748b);
}

.integrity-env-loader__stroke {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 80;
  stroke-miterlimit: 10;
  stroke-linecap: square;
  stroke-linejoin: miter;
  stroke-dasharray: 2214;
  stroke-dashoffset: 2214;
  animation: integrity-env-draw 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.integrity-env-loader__stroke--a {
  animation-delay: 0s;
}

.integrity-env-loader__stroke--b {
  animation-delay: 0.2s;
  stroke: color-mix(in srgb, var(--color-accent) 78%, #38bdf8);
}

.integrity-env-loader__stroke--c {
  animation-delay: 0.4s;
  stroke: color-mix(in srgb, var(--color-accent) 62%, #64748b);
}

.integrity-env-loader__label {
  animation: integrity-env-label 2.8s ease-in-out infinite;
}

.integrity-env-loader__dot {
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: var(--color-accent);
  opacity: 0.25;
  animation: integrity-env-dot 1.2s ease-in-out infinite;
}

.integrity-env-loader__dot:nth-child(2) {
  animation-delay: 0.15s;
}

.integrity-env-loader__dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes integrity-env-card-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes integrity-env-draw {
  0% {
    stroke-dashoffset: 2214;
    opacity: 0.4;
  }
  40% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  72% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -2214;
    opacity: 0.35;
  }
}

@keyframes integrity-env-fill {
  0%,
  35% {
    opacity: 0;
  }
  48%,
  72% {
    opacity: 0.18;
  }
  100% {
    opacity: 0;
  }
}

@keyframes integrity-env-glow {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.92);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes integrity-env-label {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}

@keyframes integrity-env-dot {
  0%,
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .integrity-env-card,
  .integrity-env-loader__glow,
  .integrity-env-loader__stroke,
  .integrity-env-loader__fill,
  .integrity-env-loader__label,
  .integrity-env-loader__dot {
    animation: none;
  }

  .integrity-env-loader__stroke {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  .integrity-env-loader__fill {
    opacity: 0.2;
  }

  .integrity-env-loader__dot {
    opacity: 0.5;
  }
}
</style>
