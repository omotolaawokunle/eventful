<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

const auth = useAuthStore();
onMounted(async () => {
  if (auth.isAuthenticated) {
    try { await auth.fetchProfile(); } catch {}
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
