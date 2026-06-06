<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowRight, Sparkles, Shield, Share2, QrCode, Bell } from 'lucide-vue-next';
import api from '@/lib/api';
import EventCard from '@/components/events/EventCard.vue';
import Button from '@/components/ui/Button.vue';
import type { Event } from '@/types';

const events = ref<Event[]>([]);

onMounted(async () => {
  try {
    const res: any = await api.get('/events', { params: { limit: 6 } });
    events.value = res.data.events;
  } catch {}
});
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-cta-400 rounded-full blur-3xl" />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="max-w-3xl">
          <div class="flex items-center gap-2 mb-6">
            <Sparkles class="w-5 h-5 text-primary-200" />
            <span class="text-primary-200 font-semibold text-sm tracking-widest uppercase">Your Passport to Unforgettable Moments</span>
          </div>
          <h1 class="font-heading text-6xl md:text-8xl leading-none mb-6">
            Where <span class="text-primary-200">Moments</span><br />
            Become Memories
          </h1>
          <p class="text-lg md:text-xl text-primary-100 mb-8 max-w-xl leading-relaxed">
            From pulsating concerts to captivating theater, thrilling sports to enlightening cultural gatherings — we curate experiences for every passion.
          </p>
          <div class="flex flex-wrap gap-4">
            <router-link to="/events">
              <Button variant="cta" size="lg">Explore Events <ArrowRight class="w-5 h-5 ml-2" /></Button>
            </router-link>
            <router-link to="/register">
              <Button variant="secondary" size="lg">Get Started</Button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 text-center">
          <QrCode class="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p class="font-heading text-xl text-primary-800">QR Access</p>
          <p class="text-sm text-primary-500">Secure ticket verification</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 text-center">
          <Share2 class="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p class="font-heading text-xl text-primary-800">Share Events</p>
          <p class="text-sm text-primary-500">Share on any platform</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 text-center">
          <Bell class="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p class="font-heading text-xl text-primary-800">Reminders</p>
          <p class="text-sm text-primary-500">Never miss an event</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 text-center">
          <Shield class="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p class="font-heading text-xl text-primary-800">Secure</p>
          <p class="text-sm text-primary-500">Paystack payment</p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="font-heading text-4xl md:text-5xl text-primary-800">Featured Events</h2>
          <p class="text-primary-500 mt-2">Discover trending experiences near you</p>
        </div>
        <router-link to="/events" class="hidden sm:flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
          View All <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div>
      <div v-if="events.length === 0" class="text-center py-12">
        <p class="text-primary-400 text-lg">No events yet. Check back soon!</p>
      </div>
      <div class="mt-8 text-center sm:hidden">
        <router-link to="/events">
          <Button variant="primary">View All Events <ArrowRight class="w-4 h-4 ml-1" /></Button>
        </router-link>
      </div>
    </section>

    <section class="bg-primary-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-heading text-4xl md:text-5xl text-primary-800 mb-4">Ready to Create Your Own Event?</h2>
        <p class="text-primary-600 mb-8 max-w-lg mx-auto">Join creators who trust Eventful to bring their events to life. Start publishing in minutes.</p>
        <router-link to="/register">
          <Button variant="cta" size="lg">Become a Creator <ArrowRight class="w-5 h-5 ml-2" /></Button>
        </router-link>
      </div>
    </section>
  </div>
</template>
