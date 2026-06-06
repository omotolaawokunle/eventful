<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const auth = useAuthStore();
const form = ref({ firstName: '', lastName: '', phone: '' });
const loading = ref(false);

onMounted(async () => {
  try {
    const res: any = await api.get('/users/me');
    form.value = { firstName: res.data.firstName, lastName: res.data.lastName, phone: res.data.phone || '' };
  } catch {}
});

async function updateProfile() {
  loading.value = true;
  try {
    await api.patch('/users/me', form.value);
    await auth.fetchProfile();
  } catch {}
  loading.value = false;
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="font-heading text-5xl text-primary-800 mb-8">Profile</h1>
    <div class="bg-white rounded-2xl border border-primary-100 p-8 shadow-lg">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center">
          <span class="font-heading text-2xl text-primary-600">{{ auth.user?.firstName?.charAt(0) }}{{ auth.user?.lastName?.charAt(0) }}</span>
        </div>
        <div>
          <p class="font-heading text-2xl text-primary-800">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
          <p class="text-primary-500">{{ auth.user?.email }}</p>
          <span class="inline-block px-2 py-0.5 bg-primary-100 rounded text-xs font-semibold text-primary-600 mt-1">{{ auth.user?.role }}</span>
        </div>
      </div>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.firstName" label="First Name" />
          <Input v-model="form.lastName" label="Last Name" />
        </div>
        <Input v-model="form.phone" label="Phone" type="tel" />
        <Button type="submit" variant="primary" :loading="loading">Update Profile</Button>
      </form>
    </div>
  </div>
</template>
