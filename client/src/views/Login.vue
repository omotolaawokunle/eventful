<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const router = useRouter();
const auth = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push(auth.isCreator ? '/creator/dashboard' : '/tickets');
  } catch (err: any) {
    const msg = err?.message;
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Invalid credentials');
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl border border-primary-100 p-8 shadow-lg">
        <div class="text-center mb-8">
          <h1 class="font-heading text-4xl text-primary-800">Welcome Back</h1>
          <p class="text-primary-500 mt-2">Sign in to continue to Eventful</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <Input v-model="email" label="Email" type="email" placeholder="you@example.com" />
          <Input v-model="password" label="Password" type="password" placeholder="Your password" />
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <Button type="submit" variant="primary" size="lg" class="w-full" :loading="loading">Sign In</Button>
        </form>
        <p class="text-center text-sm text-primary-500 mt-6">
          Don't have an account? <router-link to="/register" class="text-primary-600 font-semibold hover:text-primary-700">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
