import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/events', name: 'Events', component: () => import('@/views/Events.vue') },
  { path: '/events/:id', name: 'EventDetail', component: () => import('@/views/EventDetail.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
  { path: '/profile', name: 'Profile', component: () => import('@/views/Profile.vue'), meta: { requiresAuth: true } },
  { path: '/tickets', name: 'MyTickets', component: () => import('@/views/MyTickets.vue'), meta: { requiresAuth: true } },
  { path: '/checkout/:eventId', name: 'Checkout', component: () => import('@/views/Checkout.vue'), meta: { requiresAuth: true } },
  { path: '/reminders', name: 'MyReminders', component: () => import('@/views/MyReminders.vue'), meta: { requiresAuth: true } },
  { path: '/creator/dashboard', name: 'CreatorDashboard', component: () => import('@/views/CreatorDashboard.vue'), meta: { requiresAuth: true, requiresCreator: true } },
  { path: '/creator/events', name: 'MyEvents', component: () => import('@/views/MyEvents.vue'), meta: { requiresAuth: true, requiresCreator: true } },
  { path: '/creator/events/new', name: 'CreateEvent', component: () => import('@/views/CreateEvent.vue'), meta: { requiresAuth: true, requiresCreator: true } },
  { path: '/creator/events/:id/analytics', name: 'EventAnalytics', component: () => import('@/views/EventAnalytics.vue'), meta: { requiresAuth: true, requiresCreator: true } },
  { path: '/creator/events/:id/attendees', name: 'EventAttendees', component: () => import('@/views/EventAttendees.vue'), meta: { requiresAuth: true, requiresCreator: true } },
  { path: '/creator/payments', name: 'PaymentHistory', component: () => import('@/views/PaymentHistory.vue'), meta: { requiresAuth: true, requiresCreator: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('accessToken');
  if (to.meta.requiresAuth && !token) next('/login');
  else next();
});

export default router;
