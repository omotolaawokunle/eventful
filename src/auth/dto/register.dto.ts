import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum RegisterRole {
  CREATOR = 'CREATOR',
  EVENTEE = 'EVENTEE',
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(RegisterRole)
  @IsOptional()
  role?: RegisterRole;

  @IsString()
  @IsOptional()
  phone?: string;
}
