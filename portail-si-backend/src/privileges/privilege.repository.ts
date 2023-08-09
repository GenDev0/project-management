import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { Privilege } from './entities/privilege.entity';
import { User } from 'src/auth/entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';

export class PrivilegeRepository extends Repository<Privilege> {
  constructor(
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
  ) // private abilityFactory: AbilityFactory, // private abilityFactory: AbilityFactory,
  {
    super(
      privilegeRepository.target,
      privilegeRepository.manager,
      privilegeRepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Get All(byfiltre) Privileges
  async getPrivileges(
    filterPrivilegeIds: number[],
    user: User,
  ): Promise<Privilege[]> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const query = this.privilegeRepository.createQueryBuilder('privilege');

    if (filterPrivilegeIds) {
      query.andWhereInIds(filterPrivilegeIds);
    }

    const privileges = await query.getMany();
    return privileges;
    // let accessible_privileges = [];

    // privileges.forEach((privilege) => {
    //   if (ability.can('read', privilege)) {
    //     accessible_privileges.push(privilege);
    //   }
    // });

    // return accessible_privileges;
  }

  // create a new Privilege
  async createPrivilege(
    createPrivilegeDto: CreatePrivilegeDto,
    user: User,
  ): Promise<Privilege> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const {
      privilege_name,
      privilege_type,
      privilege_subject,
      deleted,
      id_subject,
    } = createPrivilegeDto;
    const privilege = new Privilege();
    privilege.privilege_name = privilege_name;
    privilege.privilege_type = privilege_type;
    privilege.privilege_subject = privilege_subject;
    privilege.id_subject = id_subject;
    privilege.deleted = deleted;

    try {
      // ForbiddenError.from(ability).throwUnlessCan('create', 'Privilege');
      await privilege.save();

      return privilege;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
