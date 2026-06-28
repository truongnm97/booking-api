import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'user/user.service';
import { SignInDto } from './dto';
import { CreateUserDto } from 'user/dto';
import { UserEntity } from 'user/entity';
import { SignInEntity } from './entity';
import { Response } from 'express';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private user: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signUp(dto: CreateUserDto): Promise<Partial<UserEntity>> {
    return this.user.createUser(dto);
  }

  async signIn({ email, password }: SignInDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    const tokens = await this.signToken(user.id, user.email);

    const cache = await this.cacheManager.get(user.id);

    res.cookie('accessToken', tokens.accessToken, {
      expires: new Date(Date.now() + +this.config.get('TOKEN_EXPIRY_TIME')),
      secure: true,
      signed: true,
      httpOnly: true,
    });

    return { message: 'Logged In' };
  }

  async signOut(userId: string, res: Response) {
    res.cookie('accessToken', '', { expires: new Date() });
    await this.cacheManager.del(userId);
    return { message: 'Logged out' };
  }

  async signToken(userId: string, email: string): Promise<SignInEntity> {
    const jwtid = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: this.config.get('TOKEN_EXPIRY_TIME'),
          secret: this.config.get('JWT_SECRET'),
          jwtid,
        },
      ),
      this.jwt.signAsync(
        { sub: userId },
        {
          expiresIn: this.config.get('REFRESH_TOKEN_EXPIRY_TIME'),
          secret: this.config.get('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    await this.cacheManager.set(
      `${userId}:${jwtid}`,
      refreshToken,
      +this.config.get('REFRESH_TOKEN_EXPIRY_TIME'),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string, jwtid: string) {
    const refreshToken = await this.cacheManager.get(`${userId}:${jwtid}`)
  }
}
