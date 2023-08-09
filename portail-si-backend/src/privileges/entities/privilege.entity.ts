import { Category } from 'src/categories/entities/category.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Privilege extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  privilege_name: string;

  @Column()
  privilege_type: string;

  @Column()
  privilege_subject: string;

  @Column()
  id_subject: number;

  @Column()
  deleted: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.privileges)
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.privileges)
  projects: Project[];

  @ManyToMany(() => Category, (category) => category.privileges)
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.privileges)
  tags: Tag[];
}
