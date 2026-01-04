import { IEvent } from '@nestjs/cqrs';

/**
 * 사용자 생성 이벤트 (Event)
 * 회원가입이 완료된 후 발행되는 이벤트
 */
export class UserCreatedEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly signupVerifyToken: string,
  ) {}
}

