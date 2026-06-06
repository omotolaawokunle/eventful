<script setup lang="ts">
import { Heart } from 'lucide-vue-next';
</script>

<template>
  <footer class="bg-primary-900 text-primary-200 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary-400 rounded flex items-center justify-center">
            <span class="font-heading text-primary-900 text-sm">E</span>
          </div>
          <span class="font-heading text-xl text-primary-200 tracking-wider">EVENTFUL</span>
        </div>
        <p class="text-sm flex items-center gap-1">
          Made with <Heart class="w-3.5 h-3.5 text-primary-400 fill-primary-400" /> for unforgettable moments
        </p>
      </div>
    </div>
  </footer>
</template>
