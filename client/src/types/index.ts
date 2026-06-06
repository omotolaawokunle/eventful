export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CREATOR' | 'EVENTEE';
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  venue: string;
  city: string;
  category: string;
  bannerUrl?: string;
  totalTickets: number;
  availableTickets: number;
  price: number;
  reminderDays?: number;
  isPublished: boolean;
  createdAt: string;
  creator?: { id: string; firstName: string; lastName: string };
  _count?: { tickets: number };
}

export interface Ticket {
  id: string;
  qrCodeData: string;
  qrCodeImage?: string;
  status: 'ACTIVE' | 'USED' | 'CANCELLED' | 'REFUNDED';
  scannedAt?: string;
  event: { id: string; title: string; date: string; venue: string; city: string; bannerUrl?: string };
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  event?: { id: string; title: string };
  user?: { id: string; firstName: string; lastName: string; email: string };
  ticket?: { id: string; status: string; scannedAt?: string };
  createdAt: string;
}

export interface Reminder {
  id: string;
  remindAt: string;
  isSent: boolean;
  type: string;
  event: { id: string; title: string; date: string };
}

export interface EventAnalytics {
  eventId: string;
  eventTitle: string;
  totalTickets: number;
  availableTickets: number;
  ticketsSold: number;
  ticketsScanned: number;
  scanRate: string;
  totalRevenue: number;
  attendees: { user: { id: string; firstName: string; lastName: string; email: string } }[];
}

export interface CreatorAnalytics {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  recentPayments: Payment[];
}

export interface ShareLinks {
  url: string;
  platforms: {
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    email: string;
  };
}
