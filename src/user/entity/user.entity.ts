import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    example: '1',
  })
  id: string;

  @ApiProperty({
    example: 'admin@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
  })
  role: Role;

  @ApiProperty({
    example: 'Truong',
  })
  firstName: string;

  @ApiProperty({
    example: 'Nguyen',
  })
  lastName: string;

  @ApiHideProperty()
  hash: string

  @ApiProperty({
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  updatedAt: Date;
}
