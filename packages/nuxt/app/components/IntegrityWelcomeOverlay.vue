<script setup lang="ts">
withDefaults(defineProps<{
  show?: boolean
  label?: string
  subtitle?: string
}>(), {
  show: false,
  label: 'Bienvenido',
  subtitle: undefined,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="integrity-welcome">
      <div
        v-if="show"
        class="integrity-welcome fixed inset-0 z-[20000] flex flex-col items-center justify-center bg-white dark:bg-[#09090b] px-6"
        role="status"
        aria-live="polite"
        :aria-label="label"
      >
        <div class="relative w-32 h-32 sm:w-40 sm:h-40" aria-hidden="true">
          <div class="integrity-welcome__glow" />
          <svg
            class="relative z-10 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 1080"
            fill="none"
          >
            <!-- Guía suave -->
            <g class="integrity-welcome__guide">
              <path d="M62.663 212.634 L616.128 212.634 L616.128 766.099 L62.663 766.099 Z" />
              <path d="M465.872 465.735 L1019.337 465.735 L1019.337 1019.2 L465.872 1019.2 Z" />
              <path d="M212.6 62.8 L766.065 62.8 L766.065 616.265 L212.6 616.265 Z" />
            </g>

            <!-- Trazos secuenciales -->
            <g>
              <path
                class="integrity-welcome__stroke integrity-welcome__stroke--a"
                d="M62.663 212.634 L616.128 212.634 L616.128 766.099 L62.663 766.099 Z"
              />
              <path
                class="integrity-welcome__stroke integrity-welcome__stroke--b"
                d="M465.872 465.735 L1019.337 465.735 L1019.337 1019.2 L465.872 1019.2 Z"
              />
              <path
                class="integrity-welcome__stroke integrity-welcome__stroke--c"
                d="M212.6 62.8 L766.065 62.8 L766.065 616.265 L212.6 616.265 Z"
              />
            </g>
          </svg>
        </div>

        <p class="integrity-welcome__label mt-10 text-base sm:text-lg text-slate-800 dark:text-slate-100 tracking-[0.28em] uppercase font-medium text-center">
          {{ label }}
        </p>
        <p
          v-if="subtitle"
          class="integrity-welcome__subtitle mt-2 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 text-center"
        >
          {{ subtitle }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.integrity-welcome__glow {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-accent) 34%, transparent) 0%,
    transparent 72%
  );
  filter: blur(14px);
  animation: integrity-welcome-glow 2.4s ease-in-out infinite;
}

.integrity-welcome__guide path {
  fill: none;
  stroke: color-mix(in srgb, var(--color-accent) 18%, #cbd5e1);
  stroke-width: 80;
  stroke-miterlimit: 10;
}

.integrity-welcome__stroke {
  fill: none;
  stroke-width: 80;
  stroke-miterlimit: 10;
  stroke-linecap: square;
  stroke-linejoin: miter;
  stroke-dasharray: 2300;
  stroke-dashoffset: 2300;
  animation: integrity-welcome-stroke 1.9s cubic-bezier(0.45, 0, 0.2, 1) forwards;
}

.integrity-welcome__stroke--a {
  stroke: var(--color-accent);
  animation-delay: 0.05s;
}

.integrity-welcome__stroke--b {
  stroke: color-mix(in srgb, var(--color-accent) 78%, #38bdf8);
  animation-delay: 0.28s;
}

.integrity-welcome__stroke--c {
  stroke: color-mix(in srgb, var(--color-accent) 58%, #64748b);
  animation-delay: 0.5s;
}

.integrity-welcome__label {
  animation: integrity-welcome-label 0.8s ease-out 0.85s both;
}

.integrity-welcome__subtitle {
  animation: integrity-welcome-fade 0.6s ease-out 1.15s both;
}

.integrity-welcome-enter-active {
  transition: opacity 0.25s ease;
}

.integrity-welcome-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.integrity-welcome-enter-from {
  opacity: 0;
}

.integrity-welcome-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@keyframes integrity-welcome-stroke {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes integrity-welcome-glow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.94);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes integrity-welcome-label {
  from {
    opacity: 0;
    letter-spacing: 0.4em;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    letter-spacing: 0.28em;
    transform: translateY(0);
  }
}

@keyframes integrity-welcome-fade {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .integrity-welcome__glow,
  .integrity-welcome__stroke,
  .integrity-welcome__label,
  .integrity-welcome__subtitle {
    animation: none;
  }

  .integrity-welcome__stroke {
    stroke-dashoffset: 0;
  }

  .integrity-welcome__label,
  .integrity-welcome__subtitle {
    opacity: 1;
  }
}
</style>
