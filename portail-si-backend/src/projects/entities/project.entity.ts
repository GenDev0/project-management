import { Category } from 'src/categories/entities/category.entity';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  projectIcon: string;

  @Column({ length: 100, nullable: true })
  projectDescription: string;

  @Column({ length: 100, nullable: true })
  projectPicture: string;

  @Column()
  deleted: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Privilege, (privilege) => privilege.projects)
  @JoinTable()
  privileges: Privilege[];

  @OneToMany(() => Category, (category) => category.project)
  categories: Category[];
}
