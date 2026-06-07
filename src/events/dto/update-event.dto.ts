import { EventCategory } from './create-event.dto';

export class UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  endDate?: string;
  venue?: string;
  city?: string;
  category?: EventCategory;
  totalTickets?: number;
  price?: number;
  reminderDays?: number;
  bannerUrl?: string;
}
