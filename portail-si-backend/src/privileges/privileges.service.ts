import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { Privilege } from './entities/privilege.entity';
import { PrivilegeRepository } from './privilege.repository';
import { User } from 'src/auth/entities/user.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class PrivilegesService {
  constructor(
    private readonly privilegeRepository: PrivilegeRepository, // private abilityFactory: AbilityFactory, // private abilityFactory: AbilityFactory,
  ) {}

  //create a new Privilege
  async createPrivilege(
    createPrivilegeDto: CreatePrivilegeDto,
    user: User,
  ): Promise<Privilege> {
    return this.privilegeRepository.createPrivilege(createPrivilegeDto, user);
  }

  //Get All(byfiltre) Privileges
  async getPrivileges(
    filterPrivilegeIds: number[],
    user: User,
  ): Promise<Privilege[]> {
    return await this.privilegeRepository.getPrivileges(
      filterPrivilegeIds,
      user,
    );
  }

  //Geta Category By Id
  async getPrivilegeById(id: number, user: User): Promise<Privilege> {
    // const ability = await this.abilityFactory.defineAbility(user);
    const found = await this.privilegeRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Category with ID "${id} is Not Found"`);
    }
    try {
      // ForbiddenError.from(ability).throwUnlessCan('read', found);
      return found;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  //update a Privilege
  async updatePrivilege(
    id: number,
    updatePrivilegeDto: CreatePrivilegeDto,
    user: User,
  ): Promise<Privilege> {
    // const ability = await this.abilityFactory.defineAbility(user);

    const { privilege_name, privilege_type, privilege_subject, deleted } =
      updatePrivilegeDto;
    const privilege = await this.getPrivilegeById(id, user);
    if (privilege_name) {
      privilege.privilege_name = privilege_name;
    }
    if (privilege_type) {
      privilege.privilege_type = privilege_type;
    }
    if (privilege_subject) {
      privilege.privilege_subject = privilege_subject;
    }

    if (deleted) {
      privilege.deleted = deleted;
    }

    try {
      // ForbiddenError.from(ability).throwUnlessCan('update', privilege);
      await privilege.save();
      return privilege;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // create(createPrivilegeDto: CreatePrivilegeDto) {
  //   return 'This action adds a new privilege';
  // }

  // findAll() {
  //   return `This action returns all privileges`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} privilege`;
  // }

  // update(id: number, updatePrivilegeDto: UpdatePrivilegeDto) {
  //   return `This action updates a #${id} privilege`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} privilege`;
  // }
}
