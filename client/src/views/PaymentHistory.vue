<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DollarSign, CreditCard } from 'lucide-vue-next';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge.vue';
import type { Payment } from '@/types';

const payments = ref<Payment[]>([]);

onMounted(async () => {
  try {
    const res: any = await api.get('/payments');
    payments.value = res.data;
  } catch {}
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-2">Payment History</h1>
    <p class="text-primary-500 mb-8">All payments across your events</p>

    <div v-if="payments.length === 0" class="text-center py-20 bg-white rounded-2xl border border-primary-100">
      <CreditCard class="w-12 h-12 text-primary-300 mx-auto mb-4" />
      <p class="text-primary-400 text-lg">No payments yet</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-primary-100 overflow-hidden">
      <div v-for="p in payments" :key="p.id" class="flex items-center justify-between p-4 border-b border-primary-100 last:border-0 hover:bg-primary-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="font-semibold text-primary-800">{{ p.event?.title }}</p>
            <p class="text-sm text-primary-500">{{ p.user?.firstName }} {{ p.user?.lastName }} • {{ p.user?.email }}</p>
            <p class="text-xs text-primary-400">{{ new Date(p.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-heading text-xl text-primary-600">₦{{ p.amount.toLocaleString() }}</p>
          <Badge variant="success">{{ p.status }}</Badge>
        </div>
      </div>
    </div>
  </div>
</template>
