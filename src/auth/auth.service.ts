import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/authConfig';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User): string {
    // jwt의 payload : 실제 전달할 사용자 데이터
    const payload = { ...user };

    // jwt의 서명을 위한 시크릿 키, JWT 시크릿이 없으면 에러 발생
    const jwtSecret = this.config.jwtSecret;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET이 설정되지 않았습니다.');
    }

    // jwt의 옵션 : 토큰 만료 시간, 발행자, 수신자 등
    const options = {
      expiresIn: '1D',
      audience: user.email,
      issuer: user.email,
    } as SignOptions;

    // jwt의 토큰 생성 알고리즘 : HS256(HMAC SHA-256) 라이브러리 사용
    return jwt.sign(payload, jwtSecret, options);
  }

  verify(jwtString: string) {
    const jwtSecret = this.config.jwtSecret;

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT_SECRET이 설정되지 않았습니다.');
    }

    if (!jwtString) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }

    try {
      const payload = jwt.verify(jwtString, jwtSecret) as User & jwt.JwtPayload;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (error) {
      console.error('JWT 검증 에러:', error);

      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }
  }
}
