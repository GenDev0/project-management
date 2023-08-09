import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { getProjectsFilterDto } from './dto/get-project-filter.dto';
import { User } from 'src/auth/entities/user.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';

export class ProjectRepository extends Repository<Project> {
  constructor(
    private abilityFactory: AbilityFactory,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {
    super(
      projectRepository.target,
      projectRepository.manager,
      projectRepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Get All(byfiltre) Projects
  async getProjects(
    filterProjectDto: getProjectsFilterDto,
    user: User,
  ): Promise<{
    accessible_projects: Project[];
    total: number;
    totalPages: number;
  }> {
    const ability = await this.abilityFactory.defineAbility(user);

    const { search, page = 1 } = filterProjectDto;
    const query = this.projectRepository.createQueryBuilder('project');

    if (search) {
      query.andWhere(
        '(project.name Like :search OR project.projectDescription Like :search)',
        {
          search: `%${search}%`,
        },
      );
    }
    const pageSize = 10;
    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    let accessible_projects = [];

    data.forEach((project) => {
      if (ability.can('read', project)) {
        accessible_projects.push(project);
      }
    });
    const totalPages = Math.ceil(total / pageSize);
    return { accessible_projects, total, totalPages };
  }

  // create a new Project
  async createProject(
    user: User,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const ability = await this.abilityFactory.defineAbility(user);
    const { name, projectDescription, deleted } = createProjectDto;
    const project = new Project();
    project.name = name;
    project.deleted = deleted;
    project.projectDescription = projectDescription;

    try {
      ForbiddenError.from(ability).throwUnlessCan('create', 'Project');
      await project.save();
      return project;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
