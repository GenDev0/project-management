import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { getRolesFilterDto } from './dto/get-role-filter.dto';
import { PrivilegeRepository } from 'src/privileges/privilege.repository';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';

export class RoleRepository extends Repository<Role> {
  constructor(
    // private abilityFactory: AbilityFactory,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {
    super(
      roleRepository.target,
      roleRepository.manager,
      roleRepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Assign a Privilege to a role
  async assignPrivilegeRole(
    privilegeId: number,
    roleId: number,
    user: User,
  ): Promise<Role> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const privilege = await this.privilegeRepository.findOneBy({
      id: privilegeId,
    });
    const found = await this.roleRepository.find({
      where: { id: roleId },
      relations: ['privileges'],
    });
    const role = found[0];

    if (!role.privileges) {
      role.privileges = []; // Initialize the privileges array if it doesn't exist
    }

    role.privileges.push(privilege);

    try {
      // ForbiddenError.from(ability).throwUnlessCan('manage', role);
      await role.save();

      return role;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // Assign a Role to a User
  async assignRoleUser(
    userId: number,
    roleId: number,
    user: User,
  ): Promise<User> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const userFound = await this.userRepository.findOneBy({
      id: userId,
    });

    userFound.role_id = roleId;

    try {
      // ForbiddenError.from(ability).throwUnlessCan('manage', 'Role');
      await userFound.save();

      return userFound;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  //Get All(byfiltre) roles
  async getRoles(
    filterRoleDto: getRolesFilterDto,
    user: User,
  ): Promise<Role[]> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const { search } = filterRoleDto;
    const query = this.roleRepository.createQueryBuilder('role');

    if (search) {
      query.andWhere(
        '(role.roleName Like :search OR role.roleDescription Like :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const roles = await query.getMany();
    return roles;
    // let accessible_roles = [];

    // roles.forEach((role) => {
    //   if (ability.can('read', role)) {
    //     accessible_roles.push(role);
    //   }
    // });

    // return accessible_roles;
  }

  // create a new Role
  async createRole(createRolekDto: CreateRoleDto, user: User): Promise<Role> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const { roleName, roleDescription, roleIcon, deleted } = createRolekDto;
    const role = new Role();
    role.roleName = roleName;
    role.roleDescription = roleDescription;
    role.roleIcon = roleIcon;
    role.deleted = deleted;

    try {
      // ForbiddenError.from(ability).throwUnlessCan('create', 'Role');
      await role.save();

      return role;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
