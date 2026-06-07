import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, Min } from 'class-validator';

export enum EventCategory {
  CONCERT = 'CONCERT',
  THEATER = 'THEATER',
  SPORTS = 'SPORTS',
  CULTURAL = 'CULTURAL',
  CONFERENCE = 'CONFERENCE',
  FESTIVAL = 'FESTIVAL',
  WORKSHOP = 'WORKSHOP',
  OTHER = 'OTHER',
}

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsDateString()
  date!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  venue!: string;

  @IsString()
  city!: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsNumber()
  @Min(1)
  totalTickets!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @IsOptional()
  reminderDays?: number;

  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
