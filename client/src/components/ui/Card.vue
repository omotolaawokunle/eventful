<script setup lang="ts">
defineProps<{ hover?: boolean; padded?: boolean }>();
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl border border-primary-100 transition-all duration-200',
      hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'shadow-sm',
      padded ? 'p-6' : '',
    ]"
  >
    <slot />
  </div>
</template>
