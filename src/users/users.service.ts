import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { VerifyEmailDto } from './dto/verify-user.dto';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from './dto/login-user.dto';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  /**
   * 회원 가입
   * @param name
   * @param email
   * @param password
   */
  async createUser(name: string, email: string, password: string) {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      throw new UnprocessableEntityException('이미 존재하는 이메일입니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);

    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }
  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('checkUserExists', user);
    return user !== null;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    // await this.saveUserUsingQueryRunner(
    //   name,
    //   email,
    //   password,
    //   signupVerifyToken,
    // );
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );
  }

  private sendMemberJoinEmail(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    console.log('sendMemberJoinEmail', email, signupVerifyToken);
    return this.emailService.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      // 유저 저장
      await queryRunner.manager.save(UserEntity, user);

      // 정상동작 수행 시 커밋 - 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (error) {
      // 에러 발생 시 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 쿼리 실행 후 연결 해제 - queryRunner 객체 해제
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      await transactionalEntityManager.save(UserEntity, user);
      // throw new InternalServerErrorException('트랜잭션 에러');
    });
  }

  /**
   * 이메일 인증
   * @param dto
   * @returns
   */
  verifyEmail(dto: VerifyEmailDto): Promise<string> {
    // TODO : DB연동 후 구현
    // 1. db에서 signupVerifyToken으로 회원 가입 여부 확인 후 에러처리
    // 2. 로그인 - jwt 토큰 발급
    return Promise.resolve('method verifyEmail');
  }

  /**
   * 로그인
   * @param dto
   * @returns
   */
  login(dto: LoginDto): Promise<string> {
    // TODO
    // 1. email, password 를 가진 유저가 존재하는지 db 에서 확인 후 에러처리
    // 2. 존재한다면 jwt 토큰 발급
    // 3. 존재하지 않는다면 에러 처리
    return Promise.resolve('method login');
  }

  /**
   * 유저 정보 조회
   * @param id
   * @returns
   */
  getUserInfo(id: number): Promise<UserInfo> {
    // TODO
    // 1. id를 가진 유저가 존재하는지 db 에서 확인 후 에러처리
    // 2. 존재한다면 유저 UserInfo type으로 반환
    // 3. 존재하지 않는다면 에러 처리
    return Promise.resolve({ id: 1, name: 'test', email: 'test@test.com' });
  }
}
