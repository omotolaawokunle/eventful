import { IsUUID, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateReminderDto {
  @IsUUID()
  eventId!: string;

  @IsDateString()
  @IsOptional()
  remindAt?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  daysBefore?: number;
}
