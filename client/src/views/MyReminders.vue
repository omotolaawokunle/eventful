<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Bell, Trash2, Calendar } from 'lucide-vue-next';
import api from '@/lib/api';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import type { Reminder } from '@/types';

const reminders = ref<Reminder[]>([]);

onMounted(async () => {
  try {
    const res: any = await api.get('/notifications/reminders');
    reminders.value = res.data;
  } catch {}
});

async function deleteReminder(id: string) {
  try {
    await api.delete(`/notifications/reminders/${id}`);
    reminders.value = reminders.value.filter(r => r.id !== id);
  } catch {}
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-2">My Reminders</h1>
    <p class="text-primary-500 mb-8">Never miss an event with custom reminders</p>

    <div v-if="reminders.length === 0" class="text-center py-20 bg-white rounded-2xl border border-primary-100">
      <Bell class="w-12 h-12 text-primary-300 mx-auto mb-4" />
      <p class="text-primary-400 text-lg">No reminders set</p>
      <router-link to="/events" class="text-primary-600 font-semibold mt-2 inline-block hover:text-primary-700">Browse events to set reminders</router-link>
    </div>

    <div v-else class="space-y-3">
      <div v-for="reminder in reminders" :key="reminder.id" class="bg-white rounded-2xl border border-primary-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <h3 class="font-heading text-xl text-primary-800">{{ reminder.event.title }}</h3>
          <div class="flex items-center gap-2 mt-1 text-sm text-primary-500">
            <Calendar class="w-4 h-4" />
            Reminds {{ new Date(reminder.remindAt).toLocaleDateString() }}
            <Badge :variant="reminder.isSent ? 'success' : 'warning'">{{ reminder.isSent ? 'Sent' : 'Pending' }}</Badge>
          </div>
        </div>
        <button @click="deleteReminder(reminder.id)" class="p-2 text-primary-400 hover:text-red-500 transition-colors cursor-pointer">
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
