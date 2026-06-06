<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Search, SlidersHorizontal } from 'lucide-vue-next';
import api from '@/lib/api';
import EventCard from '@/components/events/EventCard.vue';
import Button from '@/components/ui/Button.vue';
import type { Event } from '@/types';

const events = ref<Event[]>([]);
const total = ref(0);
const search = ref('');
const category = ref('');
const city = ref('');
const page = ref(1);
const loading = ref(false);
const limit = 12;

async function fetchEvents() {
  loading.value = true;
  try {
    const params: any = { limit, page: page.value };
    if (search.value) params.search = search.value;
    if (category.value) params.category = category.value;
    if (city.value) params.city = city.value;
    const res: any = await api.get('/events', { params });
    events.value = res.data.events;
    total.value = res.data.total;
  } catch {}
  loading.value = false;
}

onMounted(fetchEvents);
watch([search, category, city, page], fetchEvents);

const categories = ['CONCERT', 'THEATER', 'SPORTS', 'CULTURAL', 'CONFERENCE', 'FESTIVAL', 'WORKSHOP', 'OTHER'];
const totalPages = computed(() => Math.ceil(total.value / limit));

import { computed } from 'vue';
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="font-heading text-5xl text-primary-800">Discover Events</h1>
      <p class="text-primary-500 mt-2">Find experiences that match your passion</p>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
        <input v-model="search" placeholder="Search events..." class="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary-200 rounded-xl focus:border-primary-500 outline-none transition-colors" />
      </div>
      <select v-model="category" class="px-4 py-3 bg-white border-2 border-primary-200 rounded-xl focus:border-primary-500 outline-none text-primary-700">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat.charAt(0) + cat.slice(1).toLowerCase() }}</option>
      </select>
      <input v-model="city" placeholder="City..." class="px-4 py-3 bg-white border-2 border-primary-200 rounded-xl focus:border-primary-500 outline-none w-full md:w-48" />
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-primary-100 h-80 animate-pulse" />
    </div>

    <div v-else-if="events.length === 0" class="text-center py-20">
      <p class="text-primary-400 text-lg">No events found matching your criteria.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
      <button @click="page--" :disabled="page === 1" class="px-4 py-2 rounded-lg border-2 border-primary-200 text-primary-700 font-semibold disabled:opacity-50 cursor-pointer hover:bg-primary-50 transition-colors">Previous</button>
      <span class="px-4 py-2 text-primary-600">Page {{ page }} of {{ totalPages }}</span>
      <button @click="page++" :disabled="page >= totalPages" class="px-4 py-2 rounded-lg border-2 border-primary-200 text-primary-700 font-semibold disabled:opacity-50 cursor-pointer hover:bg-primary-50 transition-colors">Next</button>
    </div>
  </div>
</template>
