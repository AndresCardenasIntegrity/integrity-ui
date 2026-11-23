<script setup lang="ts">
import { computed } from 'vue'
import { parseMarkdownBlocks } from '../utils/markdown'

const props = withDefaults(defineProps<{
  content: string
  showCodeLineNumbers?: boolean
}>(), {
  showCodeLineNumbers: false,
})

const blocks = computed(() => parseMarkdownBlocks(props.content))
</script>

<template>
  <article class="integrity-markdown space-y-4 text-slate-700 dark:text-zinc-300">
    <template v-for="(block, idx) in blocks" :key="idx">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="block.type === 'html'" v-html="block.html" />

      <IntegrityCodeBlock
        v-else
        :code="block.content"
        :language="block.language"
        :show-line-numbers="showCodeLineNumbers"
      />
    </template>
  </article>
</template>
