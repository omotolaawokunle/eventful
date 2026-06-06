<script setup lang="ts">
import { computed } from 'vue';
import { MapPin, Calendar, Clock, Users } from 'lucide-vue-next';
import type { Event } from '@/types';

const props = defineProps<{ event: Event }>();

const dateFormatted = computed(() => new Date(props.event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
const timeFormatted = computed(() => new Date(props.event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
const soldOut = computed(() => props.event.availableTickets <= 0);
const percentage = computed(() => Math.round(((props.event.totalTickets - props.event.availableTickets) / props.event.totalTickets) * 100));
</script>

<template>
  <router-link :to="`/events/${event.id}`" class="block group">
    <div class="bg-white rounded-2xl border border-primary-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 cursor-pointer">
      <div class="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
        <span class="font-heading text-5xl text-white/30">{{ event.category.charAt(0) }}{{ event.category.slice(1).toLowerCase() }}</span>
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">{{ event.category }}</span>
        </div>
      </div>
      <div class="p-5">
        <h3 class="font-heading text-2xl text-primary-800 group-hover:text-primary-600 transition-colors truncate">{{ event.title }}</h3>
        <div class="mt-3 space-y-1.5 text-sm text-primary-600">
          <div class="flex items-center gap-2"><Calendar class="w-4 h-4 flex-shrink-0" /> {{ dateFormatted }}</div>
          <div class="flex items-center gap-2"><Clock class="w-4 h-4 flex-shrink-0" /> {{ timeFormatted }}</div>
          <div class="flex items-center gap-2"><MapPin class="w-4 h-4 flex-shrink-0" /> {{ event.venue }}, {{ event.city }}</div>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="font-heading text-2xl text-primary-600">₦{{ event.price.toLocaleString() }}</span>
          <div class="flex items-center gap-2">
            <Users class="w-4 h-4 text-primary-400" />
            <span class="text-sm text-primary-500">{{ event.availableTickets }} left</span>
          </div>
        </div>
        <div v-if="percentage > 0" class="mt-3 w-full bg-primary-100 rounded-full h-1.5">
          <div class="bg-primary-500 h-1.5 rounded-full transition-all" :style="{ width: percentage + '%' }" />
        </div>
        <div v-if="soldOut" class="mt-3 text-center">
          <span class="text-sm font-semibold text-red-500">Sold Out</span>
        </div>
      </div>
    </div>
  </router-link>
</template>
