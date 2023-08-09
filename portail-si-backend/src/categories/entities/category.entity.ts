import { Privilege } from 'src/privileges/entities/privilege.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  BaseEntity,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  categoryIcon: string;

  @Column({ length: 100, nullable: true })
  categoryDescription: string;

  @Column()
  deleted: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Privilege, (privilege) => privilege.categories)
  @JoinTable()
  privileges: Privilege[];

  @ManyToOne(() => Project, (project) => project.categories)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Tag, (tag) => tag.category)
  tags: Tag[];
}
