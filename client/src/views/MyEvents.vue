<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, BarChart3, Users, Eye } from 'lucide-vue-next';
import api from '@/lib/api';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import type { Event } from '@/types';

const events = ref<Event[]>([]);

onMounted(async () => {
  try {
    const res: any = await api.get('/events/mine');
    events.value = res.data;
  } catch {}
});

async function togglePublish(event: Event) {
  try {
    await api.patch(`/events/${event.id}/publish`);
    event.isPublished = true;
  } catch {}
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-5xl text-primary-800">My Events</h1>
        <p class="text-primary-500 mt-2">Manage your created events</p>
      </div>
      <router-link to="/creator/events/new">
        <Button variant="primary"><Plus class="w-4 h-4 mr-1" /> New Event</Button>
      </router-link>
    </div>

    <div v-if="events.length === 0" class="text-center py-20 bg-white rounded-2xl border border-primary-100">
      <p class="text-primary-400 text-lg">No events yet</p>
      <router-link to="/creator/events/new"><Button variant="primary" class="mt-4">Create Your First Event</Button></router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="event in events" :key="event.id" class="bg-white rounded-2xl border border-primary-100 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="font-heading text-2xl text-primary-800">{{ event.title }}</h3>
              <Badge :variant="event.isPublished ? 'success' : 'warning'">{{ event.isPublished ? 'Published' : 'Draft' }}</Badge>
            </div>
            <p class="text-sm text-primary-500 mt-1">{{ new Date(event.date).toLocaleDateString() }} • {{ event.venue }}, {{ event.city }}</p>
            <p class="text-sm text-primary-500 mt-1">{{ event._count?.tickets || 0 }} tickets sold • ₦{{ (event.price * (event._count?.tickets || 0)).toLocaleString() }}</p>
          </div>
          <div class="flex gap-2 ml-4">
            <router-link :to="`/creator/events/${event.id}/analytics`" class="p-2.5 bg-primary-50 rounded-xl text-primary-600 hover:bg-primary-100 transition-colors">
              <BarChart3 class="w-5 h-5" />
            </router-link>
            <router-link :to="`/creator/events/${event.id}/attendees`" class="p-2.5 bg-primary-50 rounded-xl text-primary-600 hover:bg-primary-100 transition-colors">
              <Users class="w-5 h-5" />
            </router-link>
            <button v-if="!event.isPublished" @click="togglePublish(event)" class="p-2.5 bg-primary-50 rounded-xl text-primary-600 hover:bg-primary-100 transition-colors cursor-pointer">
              <Eye class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
