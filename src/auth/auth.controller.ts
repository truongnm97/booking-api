import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Res({ passthrough: true }) res, @Body() dto: AuthDto) {
    return this.authService.signIn(res, dto);
  }

  @Post('signOut')
  async logout(@Res({ passthrough: true }) res) {
    return this.authService.signOut(res);
  }
}
