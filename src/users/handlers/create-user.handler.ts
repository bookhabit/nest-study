import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UsersService } from '../users.service';
import { UserCreatedEvent } from '../events/user-created.event';

/**
 * 사용자 생성 명령 핸들러 (Command Handler)
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { name, email, password } = command;

    // 회원가입 처리 (이메일 전송 제외)
    const signupVerifyToken = await this.usersService.createUser(
      name,
      email,
      password,
    );

    // 회원가입 완료 후 이벤트 발행 (비동기 처리)
    this.eventBus.publish(
      new UserCreatedEvent(email, signupVerifyToken),
    );
  }
}

