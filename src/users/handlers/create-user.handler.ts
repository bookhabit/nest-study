import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UsersService } from '../users.service';

/**
 * 사용자 생성 명령 핸들러 (Command Handler)
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { name, email, password } = command;
    await this.usersService.createUser(name, email, password);
  }
}

