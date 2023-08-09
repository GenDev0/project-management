import { Privilege } from 'src/privileges/entities/privilege.entity';
import { TagDetail } from 'src/tagdetails/entities/tagdetail.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Detailpassword extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_password: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  deleted: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Privilege, (privilege) => privilege.tags)
  @JoinTable()
  privileges: Privilege[];

  @ManyToOne(() => TagDetail, (tagDetail) => tagDetail.detailPasswords)
  @JoinColumn({ name: 'tagDetail_id' })
  tagDetail: TagDetail;
}
