<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/lib/api';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const router = useRouter();
const form = ref({
  title: '', description: '', date: '', venue: '', city: '',
  totalTickets: 100, price: 0, category: 'OTHER', reminderDays: 0,
});
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const payload = { ...form.value, totalTickets: Number(form.value.totalTickets), price: Number(form.value.price), reminderDays: form.value.reminderDays ? Number(form.value.reminderDays) : undefined };
    await api.post('/events', payload);
    router.push('/creator/events');
  } catch (err: any) {
    const msg = err?.message;
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to create event');
  }
  loading.value = false;
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-8">Create Event</h1>
    <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-primary-100 p-8 shadow-lg space-y-5">
      <Input v-model="form.title" label="Event Title" placeholder="Afro Nation Lagos 2025" />
      <div>
        <label class="block text-sm font-semibold text-primary-800 mb-1">Description</label>
        <textarea v-model="form.description" rows="4" placeholder="Describe your event..." class="w-full px-4 py-2.5 rounded-lg border-2 border-primary-200 focus:border-primary-500 outline-none transition-colors resize-none" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Input v-model="form.date" label="Date & Time" type="datetime-local" />
        <div>
          <label class="block text-sm font-semibold text-primary-800 mb-1">Category</label>
          <select v-model="form.category" class="w-full px-4 py-2.5 rounded-lg border-2 border-primary-200 focus:border-primary-500 outline-none text-primary-700">
            <option value="CONCERT">Concert</option><option value="THEATER">Theater</option><option value="SPORTS">Sports</option>
            <option value="CULTURAL">Cultural</option><option value="CONFERENCE">Conference</option><option value="FESTIVAL">Festival</option>
            <option value="WORKSHOP">Workshop</option><option value="OTHER">Other</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <Input v-model="form.venue" label="Venue" placeholder="Eko Convention Centre" />
        <Input v-model="form.city" label="City" placeholder="Lagos" />
      </div>
      <div class="grid grid-cols-3 gap-4">
        <Input v-model.number="form.totalTickets" label="Total Tickets" type="number" />
        <Input v-model.number="form.price" label="Price (₦)" type="number" />
        <Input v-model.number="form.reminderDays" label="Reminder (days before)" type="number" />
      </div>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div class="flex gap-4 pt-4">
        <Button type="submit" variant="primary" size="lg" :loading="loading">Create Event</Button>
        <Button type="button" variant="outline" size="lg" @click="router.back()">Cancel</Button>
      </div>
    </form>
  </div>
</template>
