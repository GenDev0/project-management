import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ForbiddenException,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ForbiddenError } from '@casl/ability';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Project } from './entities/project.entity';
import { getProjectsFilterDto } from './dto/get-project-filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Create a new Project
  @Post()
  @UsePipes(ValidationPipe)
  createProject(
    @GetUser() user: User,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsService.createProject(user, createProjectDto);
  }

  //Get All(byfiltre) Projects
  @Get()
  getProjects(
    @Query(ValidationPipe) filterProjectDto: getProjectsFilterDto,
    @GetUser() user: User,
  ): Promise<{
    accessible_projects: Project[];
    total: number;
    totalPages: number;
  }> {
    return this.projectsService.getProjects(filterProjectDto, user);
  }

  @Get('/:id')
  getProjectById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Project> {
    try {
      return this.projectsService.getProjectById(id, user);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Patch('/:id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    try {
      return this.projectsService.updateProject(id, user, createProjectDto);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // @Post()
  // create(@Body() createProjectDto: CreateProjectDto) {
  //   return this.projectsService.create(createProjectDto);
  // }

  // @Get()
  // findAll() {
  //   return this.projectsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.projectsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectsService.update(+id, updateProjectDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
