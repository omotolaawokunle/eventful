<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Mail, User } from 'lucide-vue-next';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge.vue';

const route = useRoute();
const router = useRouter();
const attendees = ref<any[]>([]);

onMounted(async () => {
  try {
    const res: any = await api.get(`/tickets/event/${route.params.id}`);
    attendees.value = res.data;
  } catch {}
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <button @click="router.back()" class="flex items-center gap-2 text-primary-600 font-semibold mb-6 hover:text-primary-700 transition-colors cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> Back
    </button>

    <h1 class="font-heading text-5xl text-primary-800 mb-2">Attendees</h1>
    <p class="text-primary-500 mb-8">{{ attendees.length }} registered attendees</p>

    <div v-if="attendees.length === 0" class="text-center py-20 bg-white rounded-2xl border border-primary-100">
      <User class="w-12 h-12 text-primary-300 mx-auto mb-4" />
      <p class="text-primary-400 text-lg">No attendees yet</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-primary-100 overflow-hidden">
      <div v-for="(ticket, i) in attendees" :key="ticket.id" class="flex items-center justify-between p-4 border-b border-primary-100 last:border-0 hover:bg-primary-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
            <span class="font-heading text-primary-600">{{ ticket.user?.firstName?.charAt(0) }}{{ ticket.user?.lastName?.charAt(0) }}</span>
          </div>
          <div>
            <p class="font-semibold text-primary-800">{{ ticket.user?.firstName }} {{ ticket.user?.lastName }}</p>
            <div class="flex items-center gap-1 text-sm text-primary-500">
              <Mail class="w-3.5 h-3.5" /> {{ ticket.user?.email }}
            </div>
          </div>
        </div>
        <Badge :variant="ticket.status === 'ACTIVE' ? 'success' : ticket.status === 'USED' ? 'warning' : 'danger'">{{ ticket.status }}</Badge>
      </div>
    </div>
  </div>
</template>
