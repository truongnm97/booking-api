import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser } from 'auth/decorator';
import { JwtGuard, Roles, RolesGuard } from 'auth/guard';
import { CreateUserDto, EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entity';

@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  @ApiBody({ type: EditUserDto })
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  editMe(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post()
  @Roles(Role.ADMIN)
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  editUser(@Param('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
