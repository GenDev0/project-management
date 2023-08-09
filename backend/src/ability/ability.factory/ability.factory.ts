import { UserRepository } from './../../auth/user.repository';
import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { RoleRepository } from 'src/roles/role.repository';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Role)
    private readonly roleRepository: RoleRepository,
  ) {}

  async defineAbility(user: User): Promise<MongoAbility> {
    const { can, cannot, build } = new AbilityBuilder<MongoAbility>(
      createMongoAbility,
    );

    const found = await this.roleRepository.find({
      where: { id: user.role_id },
      relations: ['privileges'],
    });
    const role = found[0];
    const privileges = role.privileges;

    // const privileges = await this.privilegeRepository
    //   .createQueryBuilder('privilege')
    //   .leftJoin('privilege.user', 'user')
    //   .where('user.id = :userId', { userId: user.id })
    //   .getMany();
    privileges.forEach((privilege) => {
      if (privilege.privilege_type === 'manage') {
        can(privilege.privilege_type, privilege.privilege_subject);
      } else if (privilege.privilege_subject === 'Project') {
        can(privilege.privilege_type, privilege.privilege_subject, {
          id: { $eq: privilege.id_subject },
        }).because(
          `you can only ${privilege.privilege_type} ${privilege.privilege_subject} ${privilege.id_subject}`,
        );
      } else {
        can(privilege.privilege_type, privilege.privilege_subject, {
          projectId: { $eq: privilege.id_subject },
        }).because(
          `you can only ${privilege.privilege_type} ${privilege.privilege_subject} ${privilege.id_subject}`,
        );
      }
    });

    return build();
  }
}
