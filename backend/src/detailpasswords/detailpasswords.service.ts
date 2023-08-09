import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDetailpasswordDto } from './dto/create-detailpassword.dto';
import { UpdateDetailpasswordDto } from './dto/update-detailpassword.dto';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { Detailpasswordrepository } from './detailpassword.repository';
import { ForbiddenError } from '@casl/ability';
import { User } from 'src/auth/entities/user.entity';
import { Detailpassword } from './entities/detailpassword.entity';

@Injectable()
export class DetailpasswordsService {
  constructor(
    private abilityFactory: AbilityFactory,
    private readonly detailPasswordrepository: Detailpasswordrepository,
  ) {}

  //Get All(byfiltre) Detailpasswords
  async getDetailpasswords(user: User): Promise<Detailpassword[]> {
    return await this.detailPasswordrepository.getDetailpasswords(user);
  }

  //Geta Detailpassword By Id
  async getDetailpasswordById(id: number, user: User): Promise<Detailpassword> {
    const ability = await this.abilityFactory.defineAbility(user);
    const found = await this.detailPasswordrepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(
        `Detailpassword with ID "${id} is Not Found"`,
      );
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

  //create a new Detailpassword
  async createDetailpassword(
    user: User,
    createDetailpasswordDto: CreateDetailpasswordDto,
  ): Promise<Detailpassword> {
    return this.detailPasswordrepository.createDetailpassword(
      user,
      createDetailpasswordDto,
    );
  }

  //update a Detailpassword
  async updateDetailpassword(
    id: number,
    user: User,
    updateDetailpasswordDto: CreateDetailpasswordDto,
  ): Promise<Detailpassword> {
    const ability = await this.abilityFactory.defineAbility(user);
    const { category_password, username, projectId, password, deleted } =
      updateDetailpasswordDto;
    const detailPassword = await this.getDetailpasswordById(id, user);
    if (category_password) {
      detailPassword.category_password = category_password;
    }
    if (username) {
      detailPassword.username = username;
    }
    if (projectId) {
      detailPassword.projectId = projectId;
    } else {
      throw new NotFoundException('you must enter Project Id');
    }
    if (password) {
      detailPassword.password = password;
    }
    if (deleted) {
      detailPassword.deleted = deleted;
    }
    try {
      ForbiddenError.from(ability).throwUnlessCan('update', 'Detailpassword');
      await detailPassword.save();
      return detailPassword;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
