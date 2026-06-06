import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RegisterRole {
  CREATOR = 'CREATOR',
  EVENTEE = 'EVENTEE',
}

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: RegisterRole, default: RegisterRole.EVENTEE })
  @IsEnum(RegisterRole)
  @IsOptional()
  role?: RegisterRole;

  @ApiProperty({ example: '+2348012345678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
