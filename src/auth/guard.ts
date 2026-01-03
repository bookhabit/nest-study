import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const token = request.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new BadRequestException('토큰이 없습니다.');
    }

    console.log('🔍 추출된 토큰:', token);

    // 토큰 검증
    try {
      this.authService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }

    return true;
  }
}
