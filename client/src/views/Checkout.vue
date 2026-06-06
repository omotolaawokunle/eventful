<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ShoppingCart, Minus, Plus } from 'lucide-vue-next';
import api from '@/lib/api';
import Button from '@/components/ui/Button.vue';
import type { Event } from '@/types';

const route = useRoute();
const event = ref<Event | null>(null);
const quantity = ref(1);
const loading = ref(false);
const payUrl = ref('');

onMounted(async () => {
  try {
    const res: any = await api.get(`/events/${route.params.eventId}`);
    event.value = res.data;
  } catch {}
});

const total = computed(() => (event.value?.price || 0) * quantity.value);

async function handlePurchase() {
  loading.value = true;
  try {
    const res: any = await api.post('/payments/initialize', { eventId: route.params.eventId, quantity: quantity.value });
    payUrl.value = res.data.paymentUrl;
    window.location.href = res.data.paymentUrl;
  } catch {}
  loading.value = false;
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-8">Checkout</h1>

    <div v-if="event" class="bg-white rounded-2xl border border-primary-100 p-8 shadow-lg">
      <h2 class="font-heading text-2xl text-primary-800">{{ event.title }}</h2>
      <div class="text-sm text-primary-500 mt-1">{{ event.venue }}, {{ event.city }} • {{ new Date(event.date).toLocaleDateString() }}</div>

      <div class="my-6 h-px bg-primary-100" />

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-primary-500">Ticket Price</p>
          <p class="font-heading text-2xl text-primary-700">₦{{ event.price.toLocaleString() }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="quantity = Math.max(1, quantity - 1)" class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer"><Minus class="w-4 h-4" /></button>
          <span class="font-heading text-2xl text-primary-800 w-8 text-center">{{ quantity }}</span>
          <button @click="quantity = Math.min(10, quantity + 1)" class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer"><Plus class="w-4 h-4" /></button>
        </div>
      </div>

      <div class="my-6 h-px bg-primary-100" />

      <div class="flex items-center justify-between mb-6">
        <p class="font-heading text-xl text-primary-800">Total</p>
        <p class="font-heading text-3xl text-primary-600">₦{{ total.toLocaleString() }}</p>
      </div>

      <Button variant="cta" size="lg" class="w-full" :loading="loading" @click="handlePurchase">
        <ShoppingCart class="w-5 h-5 mr-2" /> Pay with Paystack
      </Button>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-primary-400">Loading event details...</p>
    </div>
  </div>
</template>
