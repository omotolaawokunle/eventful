import { IsUUID, IsDateString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty({ example: 'uuid-of-event' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ example: '2025-12-24T18:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  remindAt?: string;

  @ApiProperty({ example: 1, required: false, description: 'Days before event' })
  @IsInt()
  @Min(1)
  @IsOptional()
  daysBefore?: number;
}
