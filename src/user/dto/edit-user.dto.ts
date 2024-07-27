import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({ example: 'admin@gmail.com' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Truong' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Nguyen' })
  lastName?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
