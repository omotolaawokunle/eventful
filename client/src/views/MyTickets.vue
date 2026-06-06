<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Ticket, Calendar, MapPin, QrCode } from 'lucide-vue-next';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge.vue';
import type { Ticket as TicketType } from '@/types';

const tickets = ref<TicketType[]>([]);
const selectedTicket = ref<TicketType | null>(null);
const showQr = ref(false);

onMounted(async () => {
  try {
    const res: any = await api.get('/tickets/mine');
    tickets.value = res.data;
  } catch {}
});

const statusVariant = (status: string) => {
  if (status === 'ACTIVE') return 'success';
  if (status === 'USED') return 'warning';
  return 'danger';
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-2">My Tickets</h1>
    <p class="text-primary-500 mb-8">All your event tickets in one place</p>

    <div v-if="tickets.length === 0" class="text-center py-20 bg-white rounded-2xl border border-primary-100">
      <Ticket class="w-12 h-12 text-primary-300 mx-auto mb-4" />
      <p class="text-primary-400 text-lg">No tickets yet</p>
      <router-link to="/events" class="text-primary-600 font-semibold mt-2 inline-block hover:text-primary-700">Browse events</router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white rounded-2xl border border-primary-100 p-6 flex flex-col sm:flex-row items-start gap-4 hover:shadow-md transition-shadow">
        <div class="flex-1">
          <div class="flex items-start justify-between">
            <h3 class="font-heading text-2xl text-primary-800">{{ ticket.event.title }}</h3>
            <Badge :variant="statusVariant(ticket.status)">{{ ticket.status }}</Badge>
          </div>
          <div class="mt-2 space-y-1 text-sm text-primary-600">
            <div class="flex items-center gap-2"><Calendar class="w-4 h-4" /> {{ new Date(ticket.event.date).toLocaleDateString() }}</div>
            <div class="flex items-center gap-2"><MapPin class="w-4 h-4" /> {{ ticket.event.venue }}, {{ ticket.event.city }}</div>
          </div>
        </div>
        <button v-if="ticket.qrCodeImage" @click="selectedTicket = ticket; showQr = true" class="flex-shrink-0 p-3 bg-primary-50 rounded-xl text-primary-600 hover:bg-primary-100 transition-colors cursor-pointer">
          <QrCode class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div v-if="showQr && selectedTicket" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click="showQr = false">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-full" @click.stop>
        <h3 class="font-heading text-2xl text-primary-800 text-center mb-4">{{ selectedTicket.event.title }}</h3>
        <img :src="selectedTicket.qrCodeImage" alt="QR Code" class="w-64 h-64 mx-auto" />
        <p class="text-center text-sm text-primary-500 mt-4">Show this QR code at the venue for verification</p>
        <button @click="showQr = false" class="mt-4 w-full py-2.5 bg-primary-100 text-primary-700 rounded-xl font-semibold hover:bg-primary-200 transition-colors cursor-pointer">Close</button>
      </div>
    </div>
  </div>
</template>
