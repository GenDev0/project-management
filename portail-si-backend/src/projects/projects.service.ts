import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './project.repository';
import { User } from 'src/auth/entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { getProjectsFilterDto } from './dto/get-project-filter.dto';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private abilityFactory: AbilityFactory,
  ) {}

  //Get All(byfiltre) Projects
  async getProjects(
    filterProjectDto: getProjectsFilterDto,
    user: User,
  ): Promise<{
    accessible_projects: Project[];
    total: number;
    totalPages: number;
  }> {
    return await this.projectRepository.getProjects(filterProjectDto, user);
  }

  //create a new Project
  async createProject(
    user: User,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectRepository.createProject(user, createProjectDto);
  }

  async getProjectById(id: number, user: User): Promise<Project> {
    // return this.taskRepository.findOneBy({ id });
    const ability = await this.abilityFactory.defineAbility(user);
    const found = await this.projectRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Project with ID "${id} is Not Found"`);
    }
    try {
      ForbiddenError.from(ability).throwUnlessCan('read', found);
      return found;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async updateProject(
    id: number,
    user: User,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const ability = await this.abilityFactory.defineAbility(user);
    const project = await this.getProjectById(id, user);
    const { name, projectDescription, deleted } = createProjectDto;
    project.name = name;
    project.deleted = deleted;
    project.projectDescription = projectDescription;

    try {
      ForbiddenError.from(ability).throwUnlessCan('update', project);
      await project.save();
      return project;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // findAll() {
  //   return `This action returns all projects`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} project`;
  // }

  // update(id: number, updateProjectDto: UpdateProjectDto) {
  //   return `This action updates a #${id} project`;
  // }

  async remove(id: number) {
    const found = await this.projectRepository.delete({ id });
    if (found.affected === 0) {
      throw new NotFoundException(`Project with ID "${id} is Not Found"`);
    }
    return { message: `Project with ID "${id} has been removed successfully"` };
  }
}
