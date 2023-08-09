import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDetailpasswordDto } from './dto/create-detailpassword.dto';
import { Detailpassword } from './entities/detailpassword.entity';

export class Detailpasswordrepository extends Repository<Detailpassword> {
  constructor(
    private abilityFactory: AbilityFactory,
    @InjectRepository(Detailpassword)
    private detailPasswordrepository: Repository<Detailpassword>,
  ) {
    super(
      detailPasswordrepository.target,
      detailPasswordrepository.manager,
      detailPasswordrepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Get All(byfiltre) Detailpasswords
  async getDetailpasswords(user: User): Promise<Detailpassword[]> {
    const ability = await this.abilityFactory.defineAbility(user);

    const query =
      this.detailPasswordrepository.createQueryBuilder('detailpassword');

    const Detailpasswords = await query.getMany();
    let accessible_Detailpasswords = [];

    Detailpasswords.forEach((Detailpassword) => {
      if (ability.can('read', Detailpassword)) {
        accessible_Detailpasswords.push(Detailpassword);
      }
    });

    return accessible_Detailpasswords;
  }

  // create a new Tag
  async createDetailpassword(
    user: User,
    createDetailpasswordDto: CreateDetailpasswordDto,
  ): Promise<Detailpassword> {
    const ability = await this.abilityFactory.defineAbility(user);
    const { category_password, username, projectId, password, deleted } =
      createDetailpasswordDto;
    const detailpassword = new Detailpassword();
    detailpassword.password = password;
    detailpassword.username = username;
    detailpassword.projectId = projectId;

    if (category_password) {
      detailpassword.category_password = category_password;
    }
    if (deleted) {
      detailpassword.deleted = deleted;
    }
    try {
      ForbiddenError.from(ability).throwUnlessCan('create', 'Detailpassword');
      await detailpassword.save();

      return detailpassword;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
