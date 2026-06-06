<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const router = useRouter();
const auth = useAuthStore();
const form = ref({ email: '', password: '', firstName: '', lastName: '', role: 'EVENTEE' });
const error = ref('');
const loading = ref(false);

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register(form.value);
    router.push(auth.isCreator ? '/creator/dashboard' : '/tickets');
  } catch (err: any) {
    const msg = err?.message;
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Registration failed');
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl border border-primary-100 p-8 shadow-lg">
        <div class="text-center mb-8">
          <h1 class="font-heading text-4xl text-primary-800">Join Eventful</h1>
          <p class="text-primary-500 mt-2">Start your journey into unforgettable moments</p>
        </div>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <Input v-model="form.firstName" label="First Name" placeholder="John" />
            <Input v-model="form.lastName" label="Last Name" placeholder="Doe" />
          </div>
          <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" />
          <Input v-model="form.password" label="Password" type="password" placeholder="Min 8 characters" />
          <div>
            <label class="block text-sm font-semibold text-primary-800 mb-1">I want to</label>
            <div class="flex gap-3">
              <button type="button" @click="form.role = 'EVENTEE'" :class="['flex-1 py-2.5 rounded-lg border-2 font-semibold transition-all cursor-pointer', form.role === 'EVENTEE' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-primary-200 text-primary-500 hover:border-primary-300']">
                Attend Events
              </button>
              <button type="button" @click="form.role = 'CREATOR'" :class="['flex-1 py-2.5 rounded-lg border-2 font-semibold transition-all cursor-pointer', form.role === 'CREATOR' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-primary-200 text-primary-500 hover:border-primary-300']">
                Create Events
              </button>
            </div>
          </div>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <Button type="submit" variant="primary" size="lg" class="w-full" :loading="loading">Create Account</Button>
        </form>
        <p class="text-center text-sm text-primary-500 mt-6">
          Already have an account? <router-link to="/login" class="text-primary-600 font-semibold">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
