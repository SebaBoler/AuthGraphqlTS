import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

export enum UserRole {
  ADMIN = "admin",
  OWNER = "owner",
  USER = "user"
}

//@Entity({ name: "users", schema: "vCommon" })
@ObjectType()
@Entity({ name: "users" })
@Index("idx_userId", ["userId"])
@Index("idx_email", ["email"], { unique: true })
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "int" })
  userId: number;

  @Field()
  @Column({ type: "varchar" })
  firstName: string;

  @Field()
  @Column({ type: "varchar" })
  lastName: string;

  @Field()
  name: string;

  @Field()
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", length: 100 })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "boolean", default: false })
  isConfirm: boolean;
  //dodanie Connection do bazy aplikacji i relacja do utworzenia
  // @Column()  wiele do jednego
  // idOwner: number;

  // @Column()  jeden do wielu
  // idContractor: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
