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
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { VerifyEmailDto } from './dto/verify-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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
    const { email, password } = dto;
    return this.usersService.login(email, password);
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
    @Headers('authorization') authorization: string,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    // Authorization 헤더 확인
    if (!authorization) {
      throw new BadRequestException('Authorization 헤더가 없습니다.');
    }

    // Bearer 토큰 추출
    const token = authorization.replace('Bearer ', '').trim();

    if (!token) {
      throw new BadRequestException('토큰이 없습니다.');
    }

    console.log('🔍 추출된 토큰:', token);

    // 토큰 검증
    try {
      const verified = this.authService.verify(token);
      console.log('✅ 토큰 검증 성공:', verified);
    } catch (error) {
      console.error('❌ 토큰 검증 실패:', error);
      throw error;
    }

    return this.usersService.getUserInfo(userId);
  }
}
