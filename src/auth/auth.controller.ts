import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'user/dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'user/entity';
import { SignInEntity } from './entity';
import { Cookies, GetUser } from './decorator';
import { Response } from 'express';
import { JwtGuard, JwtRefreshGuard } from './guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserEntity })
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('sign-out')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  async signOut(
    @GetUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(userId, res);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: SignInEntity })
  async refresh(
    @GetUser('id') userId: string,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
