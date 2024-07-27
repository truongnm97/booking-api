import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role?: Role;

  @ApiPropertyOptional({
    example: 'Nguyen',
  })
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Truong',
  })
  @IsString()
  @IsOptional()
  firstName?: string;
}
