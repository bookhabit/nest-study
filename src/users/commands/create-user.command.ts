import { ICommand } from '@nestjs/cqrs';

/**
 * 사용자 생성 명령 (Command)
 */
export class CreateUserCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}

