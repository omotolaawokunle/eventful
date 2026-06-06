<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { LogOut, Ticket, Bell, BarChart3, PlusCircle, CreditCard, User, Menu, X, ChevronDown } from 'lucide-vue-next';

const auth = useAuthStore();
const mobileOpen = ref(false);
const profileOpen = ref(false);
const creatorOpen = ref(false);

const initials = computed(() => {
  if (!auth.user) return '';
  return `${auth.user.firstName?.charAt(0)}${auth.user.lastName?.charAt(0)}`;
});

const creatorLinks = [
  { label: 'Dashboard', to: '/creator/dashboard', icon: BarChart3 },
  { label: 'My Events', to: '/creator/events', icon: PlusCircle },
  { label: 'Payments', to: '/creator/payments', icon: CreditCard },
];

function closeAll() {
  profileOpen.value = false;
  creatorOpen.value = false;
  mobileOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-dropdown]')) {
    profileOpen.value = false;
    creatorOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-6">
          <router-link to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="font-heading text-white text-xl leading-none">E</span>
            </div>
            <span class="font-heading text-2xl text-primary-700 tracking-wider">EVENTFUL</span>
          </router-link>

          <div class="hidden md:flex items-center gap-1">
            <router-link to="/events" class="px-3 py-2 text-sm font-semibold text-primary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              Browse Events
            </router-link>
            <template v-if="auth.isAuthenticated">
              <router-link to="/tickets" class="px-3 py-2 text-sm font-semibold text-primary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                My Tickets
              </router-link>
              <router-link to="/reminders" class="px-3 py-2 text-sm font-semibold text-primary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Reminders
              </router-link>
              <div v-if="auth.isCreator" data-dropdown class="relative">
                <button @click="creatorOpen = !creatorOpen" class="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-primary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer">
                  <BarChart3 class="w-4 h-4" /> Creator <ChevronDown class="w-3.5 h-3.5" :class="creatorOpen ? 'rotate-180' : ''" />
                </button>
                <div v-if="creatorOpen" class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-primary-100 shadow-lg py-2 z-50">
                  <router-link v-for="link in creatorLinks" :key="link.label" :to="link.to" @click="closeAll"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors">
                    <component :is="link.icon" class="w-4 h-4" /> {{ link.label }}
                  </router-link>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-3">
          <template v-if="auth.isAuthenticated">
            <div data-dropdown class="relative">
              <button @click="profileOpen = !profileOpen" class="w-9 h-9 bg-primary-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-300 transition-colors">
                <span class="font-heading text-sm text-primary-700">{{ initials }}</span>
              </button>
              <div v-if="profileOpen" class="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-primary-100 shadow-lg py-2 z-50">
                <div class="px-4 py-2 border-b border-primary-100 mb-1">
                  <p class="text-sm font-semibold text-primary-800 truncate">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
                  <p class="text-xs text-primary-500 truncate">{{ auth.user?.email }}</p>
                </div>
                <router-link to="/profile" @click="closeAll" class="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors">
                  <User class="w-4 h-4" /> Profile
                </router-link>
                <hr class="mx-3 my-1 border-primary-100" />
                <button @click="auth.logout" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                  <LogOut class="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="text-sm font-semibold text-primary-700 hover:text-primary-600 px-3 py-2 transition-colors">Login</router-link>
            <router-link to="/register" class="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">Get Started</router-link>
          </template>
        </div>

        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 cursor-pointer">
          <Menu v-if="!mobileOpen" class="w-6 h-6 text-primary-700" />
          <X v-else class="w-6 h-6 text-primary-700" />
        </button>
      </div>
    </div>

    <div v-show="mobileOpen" class="md:hidden bg-white border-t border-primary-100 px-4 py-4 space-y-1">
      <router-link to="/events" @click="closeAll" class="flex items-center gap-2 py-2.5 text-primary-700 font-semibold">Browse Events</router-link>
      <template v-if="auth.isAuthenticated">
        <hr class="my-2 border-primary-100" />
        <router-link to="/tickets" @click="closeAll" class="flex items-center gap-2 py-2.5 text-primary-700 font-semibold">
          <Ticket class="w-4 h-4" /> My Tickets
        </router-link>
        <router-link to="/reminders" @click="closeAll" class="flex items-center gap-2 py-2.5 text-primary-700 font-semibold">
          <Bell class="w-4 h-4" /> Reminders
        </router-link>
        <template v-if="auth.isCreator">
          <hr class="my-2 border-primary-100" />
          <p class="text-xs font-semibold text-primary-400 uppercase tracking-wider px-2 pt-1">Creator Tools</p>
          <router-link v-for="link in creatorLinks" :key="link.label" :to="link.to" @click="closeAll" class="flex items-center gap-2 py-2.5 text-primary-700 font-semibold pl-2">
            <component :is="link.icon" class="w-4 h-4" /> {{ link.label }}
          </router-link>
        </template>
        <hr class="my-2 border-primary-100" />
        <div class="flex items-center gap-3 px-2 py-2">
          <div class="w-9 h-9 bg-primary-200 rounded-full flex items-center justify-center">
            <span class="font-heading text-sm text-primary-700">{{ initials }}</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-primary-800">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
            <p class="text-xs text-primary-500">{{ auth.user?.email }}</p>
          </div>
        </div>
        <router-link to="/profile" @click="closeAll" class="flex items-center gap-2 py-2.5 text-primary-700 font-semibold pl-2">
          <User class="w-4 h-4" /> Profile
        </router-link>
        <button @click="auth.logout" class="flex items-center gap-2 py-2.5 text-red-500 font-semibold w-full cursor-pointer pl-2">
          <LogOut class="w-4 h-4" /> Logout
        </button>
      </template>
      <template v-else>
        <hr class="my-2 border-primary-100" />
        <router-link to="/login" @click="closeAll" class="block py-2.5 text-primary-700 font-semibold">Login</router-link>
        <router-link to="/register" @click="closeAll" class="block py-2.5 text-primary-600 font-semibold">Get Started</router-link>
      </template>
    </div>
  </nav>
  <div class="h-16" />
</template>
