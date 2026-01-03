import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService], // 다른 모듈에서 사용할 수 있도록 export
})
export class AuthModule {}
