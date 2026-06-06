<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MapPin, Calendar, Clock, Users, ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import type { Event, ShareLinks } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const event = ref<Event | null>(null);
const shareLinks = ref<ShareLinks | null>(null);
const loading = ref(true);

const dateFormatted = computed(() => event.value ? new Date(event.value.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '');
const timeFormatted = computed(() => event.value ? new Date(event.value.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '');
const soldOut = computed(() => event.value?.availableTickets === 0);
const priceDisplay = computed(() => event.value?.price === 0 ? 'Free' : `₦${event.value?.price.toLocaleString()}`);

onMounted(async () => {
  try {
    const res: any = await api.get(`/events/${route.params.id}`);
    event.value = res.data;
    const shareRes: any = await api.get(`/share/${route.params.id}`);
    shareLinks.value = shareRes.data;
  } catch {}
  loading.value = false;
});

function getShareUrl(platform: string) {
  return shareLinks.value?.platforms[platform as keyof typeof shareLinks.value.platforms] || '#';
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <button @click="router.back()" class="flex items-center gap-2 text-primary-600 font-semibold mb-6 hover:text-primary-700 transition-colors cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> Back
    </button>

    <div v-if="loading" class="space-y-6">
      <div class="h-64 bg-primary-100 rounded-2xl animate-pulse" />
      <div class="h-8 w-2/3 bg-primary-100 rounded animate-pulse" />
      <div class="h-4 w-1/2 bg-primary-100 rounded animate-pulse" />
    </div>

    <template v-else-if="event">
      <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl h-64 flex items-center justify-center mb-8 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-5 left-5 w-40 h-40 bg-white rounded-full blur-2xl" />
        </div>
        <div class="text-center relative z-10">
          <Badge>{{ event.category }}</Badge>
          <h1 class="font-heading text-4xl md:text-5xl text-white mt-4">{{ event.title }}</h1>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div>
            <h2 class="font-heading text-2xl text-primary-800 mb-3">About This Event</h2>
            <p class="text-primary-600 leading-relaxed whitespace-pre-line">{{ event.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-xl p-4 border border-primary-100">
              <Calendar class="w-5 h-5 text-primary-500 mb-1" />
              <p class="text-xs text-primary-400 font-semibold">DATE</p>
              <p class="text-primary-800 font-semibold">{{ dateFormatted }}</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-primary-100">
              <Clock class="w-5 h-5 text-primary-500 mb-1" />
              <p class="text-xs text-primary-400 font-semibold">TIME</p>
              <p class="text-primary-800 font-semibold">{{ timeFormatted }}</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-primary-100">
              <MapPin class="w-5 h-5 text-primary-500 mb-1" />
              <p class="text-xs text-primary-400 font-semibold">VENUE</p>
              <p class="text-primary-800 font-semibold">{{ event.venue }}</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-primary-100">
              <Users class="w-5 h-5 text-primary-500 mb-1" />
              <p class="text-xs text-primary-400 font-semibold">CAPACITY</p>
              <p class="text-primary-800 font-semibold">{{ event.availableTickets }} / {{ event.totalTickets }} left</p>
            </div>
          </div>

          <div v-if="shareLinks">
            <h3 class="font-heading text-xl text-primary-800 mb-3">Share</h3>
            <div class="flex gap-3">
              <a :href="getShareUrl('twitter')" target="_blank" class="p-2.5 bg-primary-100 rounded-xl text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a :href="getShareUrl('facebook')" target="_blank" class="p-2.5 bg-primary-100 rounded-xl text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a :href="getShareUrl('linkedin')" target="_blank" class="p-2.5 bg-primary-100 rounded-xl text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a :href="getShareUrl('whatsapp')" target="_blank" class="p-2.5 bg-primary-100 rounded-xl text-primary-600 hover:bg-primary-200 transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div class="md:col-span-1">
          <div class="bg-white rounded-2xl border border-primary-100 p-6 sticky top-24 shadow-lg">
            <p class="text-sm text-primary-400 font-semibold">PRICE</p>
            <p class="font-heading text-4xl text-primary-700 mt-1">{{ priceDisplay }}</p>
            <div class="my-4 h-px bg-primary-100" />
            <p class="text-sm text-primary-500 mb-1"><span class="font-semibold text-primary-700">{{ event.availableTickets }}</span> of {{ event.totalTickets }} tickets available</p>
            <div class="w-full bg-primary-100 rounded-full h-2 mb-6">
              <div class="bg-primary-500 h-2 rounded-full" :style="{ width: ((event.totalTickets - event.availableTickets) / event.totalTickets * 100) + '%' }" />
            </div>
            <Button v-if="auth.isAuthenticated" variant="cta" size="lg" class="w-full" :disabled="soldOut" @click="router.push(`/checkout/${event.id}`)">
              {{ soldOut ? 'Sold Out' : 'Get Tickets' }}
            </Button>
            <router-link v-else to="/login">
              <Button variant="cta" size="lg" class="w-full">Login to Buy</Button>
            </router-link>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="text-primary-400 text-lg">Event not found.</p>
      <router-link to="/events"><Button variant="primary" class="mt-4">Browse Events</Button></router-link>
    </div>
  </div>
</template>
