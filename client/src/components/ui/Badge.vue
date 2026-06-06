<script setup lang="ts">
defineProps<{ variant?: 'default' | 'success' | 'warning' | 'danger' }>();
</script>

<template>
  <span
    :class="[
      'inline-block px-3 py-1 rounded-full text-xs font-semibold',
      variant === 'success' ? 'bg-green-100 text-green-800' :
      variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      variant === 'danger' ? 'bg-red-100 text-red-800' :
      'bg-primary-100 text-primary-700',
    ]"
  >
    <slot />
  </span>
</template>
