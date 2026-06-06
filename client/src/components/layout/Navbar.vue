<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { LogOut, Ticket, Bell, PlusCircle, BarChart3, CreditCard, User, Menu, X } from 'lucide-vue-next';
import { ref } from 'vue';

const auth = useAuthStore();
const mobileOpen = ref(false);

const navLinks = computed(() => {
  const links: { label: string; to: string; icon?: any }[] = [];
  if (auth.isAuthenticated) {
    links.push({ label: 'My Tickets', to: '/tickets', icon: Ticket });
    links.push({ label: 'Reminders', to: '/reminders', icon: Bell });
    if (auth.isCreator) {
      links.push({ label: 'Dashboard', to: '/creator/dashboard', icon: BarChart3 });
      links.push({ label: 'My Events', to: '/creator/events', icon: PlusCircle });
      links.push({ label: 'Payments', to: '/creator/payments', icon: CreditCard });
    }
    links.push({ label: 'Profile', to: '/profile', icon: User });
  }
  return links;
});
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="font-heading text-white text-xl leading-none">E</span>
          </div>
          <span class="font-heading text-2xl text-primary-700 tracking-wider">EVENTFUL</span>
        </router-link>

        <div class="hidden md:flex items-center gap-6">
          <router-link
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-600 transition-colors duration-200"
          >
            <component :is="link.icon" class="w-4 h-4" />
            {{ link.label }}
          </router-link>
          <router-link to="/events" class="text-sm font-semibold text-primary-700 hover:text-primary-600">Browse Events</router-link>
          <template v-if="auth.isAuthenticated">
            <button @click="auth.logout" class="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600">
              <LogOut class="w-4 h-4" /> Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-sm font-semibold text-primary-700 hover:text-primary-600">Login</router-link>
            <router-link to="/register" class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors duration-200">Get Started</router-link>
          </template>
        </div>

        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 cursor-pointer">
          <Menu v-if="!mobileOpen" class="w-6 h-6 text-primary-700" />
          <X v-else class="w-6 h-6 text-primary-700" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="md:hidden bg-white border-t border-primary-100 px-4 py-4 space-y-3">
      <router-link v-for="link in navLinks" :key="link.label" :to="link.to" @click="mobileOpen = false"
        class="flex items-center gap-2 py-2 text-primary-700 font-semibold">
        <component :is="link.icon" class="w-4 h-4" /> {{ link.label }}
      </router-link>
      <router-link to="/events" @click="mobileOpen = false" class="block py-2 text-primary-700 font-semibold">Browse Events</router-link>
      <template v-if="auth.isAuthenticated">
        <button @click="auth.logout" class="flex items-center gap-2 py-2 text-primary-500 font-semibold w-full">
          <LogOut class="w-4 h-4" /> Logout
        </button>
      </template>
      <template v-else>
        <router-link to="/login" @click="mobileOpen = false" class="block py-2 text-primary-700 font-semibold">Login</router-link>
        <router-link to="/register" @click="mobileOpen = false" class="block py-2 text-primary-600 font-semibold">Get Started</router-link>
      </template>
    </div>
  </nav>
  <div class="h-16" />
</template>
