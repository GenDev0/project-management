import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { getRolesFilterDto } from './dto/get-role-filter.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Create a new Role
  @Post()
  @UsePipes(ValidationPipe)
  createRole(
    @Body() createRolekDto: CreateRoleDto,
    @GetUser() user: User,
  ): Promise<Role> {
    return this.rolesService.createRole(createRolekDto, user);
  }

  //Get All(byfiltre) Roles
  @Get()
  getRoles(
    @Query(ValidationPipe) filterRoleDto: getRolesFilterDto,
    @GetUser() user: User,
  ): Promise<Role[]> {
    return this.rolesService.getRoles(filterRoleDto, user);
  }

  @Get('/:id')
  getRoleById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Role> {
    try {
      return this.rolesService.getRoleById(id, user);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Patch('/:id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    try {
      return this.rolesService.updateRole(id, user, createRoleDto);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  //Assign a Privilege to a role
  @Post('assignment/privileges')
  assignPrivilegeRole(
    @GetUser() user: User,
    @Body('privilegeId', ParseIntPipe) privilegeId: number,
    @Body('roleId', ParseIntPipe) roleId: number,
  ): Promise<Role> {
    return this.rolesService.assignPrivilegeRole(privilegeId, roleId, user);
  }

  //Assign a Privilege to a role
  @Post('assignment/users')
  assignRoleUser(
    @GetUser() user: User,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('roleId', ParseIntPipe) roleId: number,
  ): Promise<User> {
    return this.rolesService.assignRoleUser(userId, roleId, user);
  }

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }

  // @Get()
  // findAll() {
  //   return this.rolesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
