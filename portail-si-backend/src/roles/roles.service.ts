import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { Role } from './entities/role.entity';
import { getRolesFilterDto } from './dto/get-role-filter.dto';
import { User } from 'src/auth/entities/user.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private abilityFactory: AbilityFactory, // private abilityFactory: AbilityFactory,
  ) {}

  //create a new Role
  async createRole(createRoleDto: CreateRoleDto, user: User): Promise<Role> {
    return this.roleRepository.createRole(createRoleDto, user);
  }

  //Get All(byfiltre) Roles
  async getRoles(
    filterRoleDto: getRolesFilterDto,
    user: User,
  ): Promise<Role[]> {
    return await this.roleRepository.getRoles(filterRoleDto, user);
  }

  async getRoleById(id: number, user: User): Promise<Role> {
    // return this.taskRepository.findOneBy({ id });
    // const found = await this.roleRepository.findOneBy({ id });
    const ability = await this.abilityFactory.defineAbility(user);
    const found1 = await this.roleRepository.find({
      where: { id },
      relations: ['privileges'],
    });

    if (!found1) {
      throw new NotFoundException(`Role with ID "${id} is Not Found"`);
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan('read', found1[0]);
      return found1[0];
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async updateRole(
    id: number,
    user: User,
    createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    const ability = await this.abilityFactory.defineAbility(user);

    const role = await this.getRoleById(id, user);
    const { roleName, roleDescription, roleIcon, deleted } = createRoleDto;
    role.roleName = roleName;
    role.deleted = deleted;
    role.roleDescription = roleDescription;
    if (roleIcon) {
      role.roleIcon = roleIcon;
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan('update', role);
      await role.save();
      return role;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  //Assign a Privilege to a role
  async assignPrivilegeRole(
    privilegeId: number,
    roleId: number,
    user: User,
  ): Promise<Role> {
    return await this.roleRepository.assignPrivilegeRole(
      privilegeId,
      roleId,
      user,
    );
  }

  //Assign a Privilege to a role
  async assignRoleUser(
    userId: number,
    roleId: number,
    user: User,
  ): Promise<User> {
    return await this.roleRepository.assignRoleUser(userId, roleId, user);
  }

  // create(createRoleDto: CreateRoleDto) {
  //   return 'This action adds a new role';
  // }

  // findAll() {
  //   return `This action returns all roles`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
