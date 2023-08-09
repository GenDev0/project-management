import { User } from 'src/auth/entities/user.entity';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_name' })
  roleName: string;

  @Column({ name: 'role_icon', nullable: true })
  roleIcon: string;

  @Column({ name: 'role_description', nullable: true })
  roleDescription: string;

  @Column()
  deleted: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Privilege, (privilege) => privilege.roles)
  @JoinTable()
  privileges: Privilege[];
}
