import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ example: 'Afro Nation Lagos 2025' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The biggest Afrobeats festival in Nigeria...' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-12-25T18:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2025-12-26T02:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'Eko Convention Centre' })
  @IsString()
  venue: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  city: string;

  @ApiProperty({ enum: EventCategory, default: EventCategory.OTHER })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(1)
  totalTickets: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 7, required: false })
  @IsNumber()
  @IsOptional()
  reminderDays?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
