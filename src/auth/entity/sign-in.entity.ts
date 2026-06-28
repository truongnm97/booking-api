import { ApiProperty } from '@nestjs/swagger';

export class SignInEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
