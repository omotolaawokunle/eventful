<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BarChart3, Ticket, DollarSign, Calendar, Users } from 'lucide-vue-next';
import api from '@/lib/api';
import Card from '@/components/ui/Card.vue';
import type { CreatorAnalytics, Payment } from '@/types';

const analytics = ref<CreatorAnalytics | null>(null);

onMounted(async () => {
  try {
    const res: any = await api.get('/analytics/overview');
    analytics.value = res.data;
  } catch {}
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-2">Creator Dashboard</h1>
    <p class="text-primary-500 mb-8">Your event empire at a glance</p>

    <div v-if="analytics" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <Card padded>
        <Calendar class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">{{ analytics.totalEvents }}</p>
        <p class="text-sm text-primary-500">Total Events</p>
      </Card>
      <Card padded>
        <Ticket class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">{{ analytics.totalTicketsSold }}</p>
        <p class="text-sm text-primary-500">Tickets Sold</p>
      </Card>
      <Card padded>
        <DollarSign class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">₦{{ analytics.totalRevenue.toLocaleString() }}</p>
        <p class="text-sm text-primary-500">Total Revenue</p>
      </Card>
      <Card padded>
        <BarChart3 class="w-8 h-8 text-primary-500 mb-2" />
        <p class="font-heading text-3xl text-primary-800">{{ analytics.totalTicketsSold > 0 ? Math.round((analytics.totalTicketsSold / (analytics.totalEvents || 1)) * 10) / 10 : 0 }}</p>
        <p class="text-sm text-primary-500">Avg per Event</p>
      </Card>
    </div>

    <div v-if="analytics?.recentPayments?.length">
      <h2 class="font-heading text-2xl text-primary-800 mb-4">Recent Payments</h2>
      <div class="bg-white rounded-2xl border border-primary-100 overflow-hidden">
        <div v-for="p in analytics.recentPayments" :key="p.id" class="flex items-center justify-between p-4 border-b border-primary-100 last:border-0">
          <div>
            <p class="font-semibold text-primary-800">{{ p.user?.firstName }} {{ p.user?.lastName }}</p>
            <p class="text-sm text-primary-500">{{ p.event?.title }}</p>
          </div>
          <p class="font-heading text-xl text-primary-600">₦{{ p.amount.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
