import { IsUUID, IsInt, Min } from 'class-validator';

export class InitializePaymentDto {
  @IsUUID()
  eventId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
