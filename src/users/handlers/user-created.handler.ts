import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-created.event';
import { EmailService } from 'src/email/email.service';
import { Logger } from '@nestjs/common';

/**
 * 사용자 생성 이벤트 핸들러 (Event Handler)
 * 회원가입 완료 후 이메일 전송을 비동기로 처리
 */
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);

  constructor(private readonly emailService: EmailService) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const { email, signupVerifyToken } = event;

    this.logger.log(`📧 회원가입 이메일 전송 시작: ${email}`);

    try {
      await this.emailService.sendMemberJoinEmail(email, signupVerifyToken);
      this.logger.log(`✅ 회원가입 이메일 전송 완료: ${email}`);
    } catch (error) {
      this.logger.error(
        `❌ 회원가입 이메일 전송 실패: ${email}`,
        error.stack,
      );
      // 이메일 전송 실패해도 회원가입은 성공한 것으로 처리
    }
  }
}

