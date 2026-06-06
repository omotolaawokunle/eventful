<script setup lang="ts">
defineProps<{
  label: string;
  type?: string;
  modelValue: string;
  error?: string;
  placeholder?: string;
}>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();
</script>

<template>
  <div>
    <label class="block text-sm font-semibold text-primary-800 mb-1">{{ label }}</label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'w-full px-4 py-2.5 rounded-lg border-2 bg-white transition-colors duration-200 outline-none',
        error ? 'border-red-400 focus:border-red-500' : 'border-primary-200 focus:border-primary-500',
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>
