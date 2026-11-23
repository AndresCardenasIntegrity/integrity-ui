<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import type { IntegrityNavGroup, IntegrityNavItem } from '../types/ui'

const props = withDefaults(defineProps<{
  brandName?: string
  brandSubtitle?: string
  navGroups: IntegrityNavGroup[]
  showThemeToggle?: boolean
}>(), {
  brandName: 'Integrity',
  brandSubtitle: 'Design System',
  showThemeToggle: true,
})

const route = useRoute()
const {
  desktopCollapsed,
  mobileOpen,
  state,
  toggleDesktop,
  toggleMobile,
  setMobileOpen,
  ensureHydrated,
  ensureKeyboardShortcut,
} = useIntegritySidebar()

const { isDark, toggleTheme, initTheme } = useIntegrityTheme()

const openGroups = reactive<Record<string, boolean>>({})

for (const group of props.navGroups) {
  openGroups[group.id] = group.defaultOpen ?? true
}

onMounted(() => {
  ensureHydrated()
  ensureKeyboardShortcut()
  initTheme()
})

const sidebarWidth = computed(() => {
  if (mobileOpen.value) return 'var(--sidebar-width-mobile)'
  return desktopCollapsed.value ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)'
})

function isGroupOpen(id: string): boolean {
  return openGroups[id] ?? true
}

function toggleGroup(id: string) {
  openGroups[id] = !isGroupOpen(id)
}

function isItemActive(item: IntegrityNavItem): boolean {
  if (item.exact || item.to === '/') {
    return route.path === item.to
  }
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function menuItemClass(item: IntegrityNavItem): string {
  const active = isItemActive(item)
  const spacing = desktopCollapsed.value ? 'justify-center px-2 py-2' : 'px-2.5 py-2'
  if (active) {
    return `${spacing} bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-medium shadow-subtle`
  }
  return `${spacing} text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]`
}
</script>

<template>
  <!-- Mobile top bar -->
  <header
    class="lg:hidden fixed top-0 left-0 right-0 z-50 px-2.5 py-1.5"
    style="color: var(--sidebar-foreground);"
  >
    <div
      class="flex items-center gap-2 rounded-2xl border px-2 py-1.5 shadow-sm backdrop-blur-md"
      style="background: color-mix(in srgb, var(--sidebar) 92%, transparent); border-color: var(--sidebar-border);"
    >
      <button
        type="button"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-[var(--sidebar-accent)] transition-colors"
        :aria-label="mobileOpen ? 'Cerrar menú' : 'Abrir menú'"
        :aria-expanded="mobileOpen"
        @click="toggleMobile"
      >
        <Icon :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="h-5 w-5" />
      </button>

      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-white">
          <IntegrityMark class="h-4 w-4" />
        </span>
        <span class="text-sm font-semibold truncate">{{ brandName }}</span>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <slot name="mobile-actions" />
        <button
          v-if="showThemeToggle"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[var(--sidebar-accent)] transition-colors"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile backdrop -->
  <div
    v-if="mobileOpen"
    class="lg:hidden fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]"
    @click="setMobileOpen(false)"
  />

  <!-- Desktop layout spacer -->
  <div
    class="hidden lg:block shrink-0 transition-[width] duration-200 ease-linear"
    :style="{ width: desktopCollapsed ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)' }"
    aria-hidden="true"
  />

  <!-- Sidebar panel -->
  <aside
    data-slot="sidebar"
    :data-state="state"
    :class="[
      'fixed top-0 bottom-0 left-0 flex flex-col border-r transition-[width,transform] duration-200 ease-linear h-dvh',
      mobileOpen ? 'z-[45] translate-x-0 shadow-2xl' : 'z-40 -translate-x-full lg:translate-x-0',
    ]"
    :style="{
      background: 'var(--sidebar)',
      borderColor: 'var(--sidebar-border)',
      color: 'var(--sidebar-foreground)',
      width: sidebarWidth,
    }"
  >
    <div class="lg:hidden shrink-0" :style="{ height: 'var(--admin-mobile-nav-h)' }" aria-hidden="true" />

    <!-- Desktop Brand Header -->
    <div
      class="relative hidden lg:flex items-center gap-2.5 border-b shrink-0"
      :class="desktopCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-3.5'"
      style="border-color: var(--sidebar-border);"
    >
      <slot name="header" :collapsed="desktopCollapsed">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-white shadow-subtle">
          <IntegrityMark class="h-4 w-4" />
        </span>
        <div v-if="!desktopCollapsed" class="min-w-0 flex-1">
          <p class="text-sm font-semibold leading-tight truncate">{{ brandName }}</p>
          <p v-if="brandSubtitle" class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {{ brandSubtitle }}
          </p>
        </div>
      </slot>

      <button
        type="button"
        class="flex absolute top-3.5 -right-3 z-20 h-6 w-6 items-center justify-center rounded-full border bg-[var(--sidebar)] text-slate-500 shadow-sm hover:text-[var(--sidebar-primary)] hover:border-[var(--sidebar-primary)]/40 transition-colors"
        style="border-color: var(--sidebar-border);"
        :title="desktopCollapsed ? 'Expandir (Ctrl+B)' : 'Colapsar (Ctrl+B)'"
        @click="toggleDesktop"
      >
        <Icon
          :name="desktopCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'"
          class="h-3.5 w-3.5"
        />
      </button>
    </div>

    <!-- Navigation groups -->
    <nav
      class="scrollbar-thin flex-1 min-h-0 overflow-y-auto overscroll-contain py-3"
      :class="desktopCollapsed ? 'px-1.5' : 'px-2.5'"
    >
      <div v-for="group in navGroups" :key="group.id" class="mb-2 last:mb-0">
        <button
          v-if="!desktopCollapsed"
          type="button"
          class="flex w-full items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:bg-[var(--sidebar-accent)] hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          :aria-expanded="isGroupOpen(group.id)"
          @click="toggleGroup(group.id)"
        >
          <span class="flex-1 text-left">{{ group.label }}</span>
          <Icon
            name="i-heroicons-chevron-down"
            class="h-3.5 w-3.5 transition-transform duration-200"
            :class="isGroupOpen(group.id) ? 'rotate-0' : '-rotate-90'"
          />
        </button>
        <div
          v-else
          class="mx-auto my-2 h-px w-6 bg-[var(--sidebar-border)]"
          aria-hidden="true"
        />

        <ul v-show="desktopCollapsed || isGroupOpen(group.id)" class="space-y-0.5 mt-0.5">
          <li v-for="item in group.items" :key="item.to">
            <NuxtLink
              :to="item.to"
              :title="item.label"
              class="flex items-center gap-2.5 rounded-lg text-sm transition-colors"
              :class="menuItemClass(item)"
              @click="setMobileOpen(false)"
            >
              <Icon :name="item.icon" class="h-4 w-4 shrink-0" />
              <span v-if="!desktopCollapsed" class="truncate flex-1">{{ item.label }}</span>
              <span
                v-if="!desktopCollapsed && item.badge"
                class="rounded-full bg-slate-200/80 dark:bg-slate-700/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-200"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer -->
    <div
      class="shrink-0 border-t"
      :class="desktopCollapsed ? 'p-2' : 'p-2.5'"
      style="border-color: var(--sidebar-border);"
    >
      <slot name="footer" :collapsed="desktopCollapsed">
        <button
          v-if="showThemeToggle"
          type="button"
          class="w-full flex items-center gap-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-[var(--sidebar-accent)] transition-colors"
          :class="desktopCollapsed ? 'justify-center p-2' : 'px-2.5 py-2'"
          :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="h-4 w-4 shrink-0" />
          <span v-if="!desktopCollapsed" class="truncate">
            {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
          </span>
        </button>
      </slot>
    </div>
  </aside>
</template>
