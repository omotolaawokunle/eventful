<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-8 py-3 text-lg' : 'px-5 py-2.5 text-base',
      variant === 'secondary' ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' :
      variant === 'outline' ? 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50' :
      variant === 'ghost' ? 'text-primary-600 hover:bg-primary-100' :
      variant === 'cta' ? 'bg-cta-600 text-white hover:bg-cta-700 shadow-lg shadow-cta-600/25' :
      'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25',
    ]"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>
