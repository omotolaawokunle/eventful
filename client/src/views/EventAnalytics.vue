<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Ticket, QrCode, DollarSign, Users } from 'lucide-vue-next';
import api from '@/lib/api';
import Card from '@/components/ui/Card.vue';
import type { EventAnalytics as Analytics } from '@/types';

const route = useRoute();
const router = useRouter();
const analytics = ref<Analytics | null>(null);

onMounted(async () => {
  try {
    const res: any = await api.get(`/analytics/event/${route.params.id}`);
    analytics.value = res.data;
  } catch {}
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <button @click="router.back()" class="flex items-center gap-2 text-primary-600 font-semibold mb-6 hover:text-primary-700 transition-colors cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> Back
    </button>

    <h1 class="font-heading text-4xl text-primary-800 mb-2" v-if="analytics">{{ analytics.eventTitle }}</h1>
    <p class="text-primary-500 mb-8">Performance metrics and insights</p>

    <div v-if="analytics" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padded>
        <Ticket class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">{{ analytics.ticketsSold }} / {{ analytics.totalTickets }}</p>
        <p class="text-sm text-primary-500">Tickets Sold</p>
      </Card>
      <Card padded>
        <QrCode class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">{{ analytics.ticketsScanned }}</p>
        <p class="text-sm text-primary-500">Scanned In</p>
      </Card>
      <Card padded>
        <Users class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">{{ analytics.attendees?.length || 0 }}</p>
        <p class="text-sm text-primary-500">Total Attendees</p>
      </Card>
      <Card padded>
        <DollarSign class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">₦{{ analytics.totalRevenue.toLocaleString() }}</p>
        <p class="text-sm text-primary-500">Revenue</p>
      </Card>
    </div>

    <div v-if="analytics" class="mt-8 bg-white rounded-2xl border border-primary-100 p-6">
      <h2 class="font-heading text-2xl text-primary-800 mb-4">Scan Rate</h2>
      <div class="flex items-center gap-4">
        <div class="w-full bg-primary-100 rounded-full h-4">
          <div class="bg-primary-500 h-4 rounded-full transition-all" :style="{ width: analytics.scanRate + '%' }" />
        </div>
        <span class="font-heading text-2xl text-primary-700 flex-shrink-0">{{ analytics.scanRate }}%</span>
      </div>
    </div>
  </div>
</template>
