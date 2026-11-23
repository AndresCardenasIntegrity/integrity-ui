<script setup lang="ts">
import { computed } from 'vue'
import type { IntegrityNavGroup } from '../types/ui'

const props = withDefaults(defineProps<{
  brandName?: string
  brandSubtitle?: string
  navGroups: IntegrityNavGroup[]
  showThemeToggle?: boolean
  maxWidth?: '4xl' | '7xl' | 'full'
  padded?: boolean
  scrollable?: boolean
  contentClass?: string
}>(), {
  brandName: 'Integrity',
  brandSubtitle: 'Design System',
  showThemeToggle: true,
  maxWidth: '7xl',
  padded: true,
  scrollable: true,
  contentClass: '',
})

const maxWidthClass = computed(() => {
  const map = {
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-none',
  } as const
  return map[props.maxWidth]
})
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
    <div class="flex min-h-screen w-full">
      <IntegritySidebar
        :brand-name="brandName"
        :brand-subtitle="brandSubtitle"
        :nav-groups="navGroups"
        :show-theme-toggle="showThemeToggle"
      >
        <template v-if="$slots['sidebar-header']" #header="slotProps">
          <slot name="sidebar-header" v-bind="slotProps" />
        </template>
        <template v-if="$slots['sidebar-footer']" #footer="slotProps">
          <slot name="sidebar-footer" v-bind="slotProps" />
        </template>
        <template v-if="$slots['mobile-actions']" #mobile-actions>
          <slot name="mobile-actions" />
        </template>
      </IntegritySidebar>

      <main
        :class="[
          'flex-1 min-w-0 overflow-x-hidden pt-[var(--admin-mobile-nav-h)] lg:pt-0',
          scrollable ? 'overflow-y-auto' : '',
        ]"
      >
        <div
          :class="[
            maxWidthClass,
            'mx-auto w-full',
            padded ? 'px-4 py-6 sm:px-6 lg:px-8 lg:py-8' : '',
            contentClass,
          ]"
        >
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
