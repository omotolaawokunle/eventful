import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/lib/api';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('accessToken'));

  const isAuthenticated = computed(() => !!token.value);
  const isCreator = computed(() => user.value?.role === 'CREATOR');

  async function login(email: string, password: string) {
    const res: any = await api.post('/auth/login', { email, password });
    token.value = res.data.accessToken;
    user.value = res.data.user;
    localStorage.setItem('accessToken', res.data.accessToken);
  }

  async function register(data: { email: string; password: string; firstName: string; lastName: string; role?: string }) {
    const res: any = await api.post('/auth/register', data);
    token.value = res.data.accessToken;
    user.value = res.data.user;
    localStorage.setItem('accessToken', res.data.accessToken);
  }

  async function fetchProfile() {
    const res: any = await api.get('/auth/profile');
    user.value = res.data;
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }

  return { user, token, isAuthenticated, isCreator, login, register, fetchProfile, logout };
});
