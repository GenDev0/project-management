import { Category } from 'src/categories/entities/category.entity';
import { Detailpassword } from 'src/detailpasswords/entities/detailpassword.entity';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import { TagDetail } from 'src/tagdetails/entities/tagdetail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column()
  name: string;

  @Column({ name: 'tag_description', nullable: true })
  tagDescription: string;

  @Column({ name: 'tag_icon', nullable: true })
  tagIcon: string;

  @Column()
  deleted: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Privilege, (privilege) => privilege.tags)
  @JoinTable()
  privileges: Privilege[];

  @ManyToOne(() => Category, (Category) => Category.tags)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => TagDetail, (tagDetail) => tagDetail.tag)
  tagDetails: TagDetail[];
}
