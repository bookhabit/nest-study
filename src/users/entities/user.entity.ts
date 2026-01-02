import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 60, nullable: true })
  signupVerifyToken: string;
}
