import { Detailpassword } from 'src/detailpasswords/entities/detailpassword.entity';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity()
export class TagDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  detail_name: string;

  @Column({ length: 100 })
  detail_value: string;

  @Column({ default: false })
  have_password: boolean;

  @Column()
  deleted: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Privilege, (privilege) => privilege.projects)
  @JoinTable()
  privileges: Privilege[];

  @ManyToOne(() => Tag, (tag) => tag.tagDetails)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @OneToMany(() => Detailpassword, (detailPassword) => detailPassword.tagDetail)
  detailPasswords: Detailpassword[];
}
