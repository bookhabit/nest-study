import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Redirect,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { VerifyEmailDto } from './dto/verify-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    // password를 문자열로 변환 (Postman에서 숫자로 보낸 경우 대비)
    const passwordString = String(password);

    await this.usersService.createUser(name, email, passwordString);

    return {
      message: '회원 가입이 완료되었습니다.',
      email: email,
    };
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    return this.usersService.verifyEmail(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<string> {
    return this.usersService.login(dto);
  }

  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);
    return 'findAll';
  }

  @Get(':id')
  async getUserInfo(
    @Param('id', ValidationPipe) id: number,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(id);
  }
}
