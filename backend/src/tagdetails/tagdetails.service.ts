import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagdetailDto } from './dto/create-tagdetail.dto';
import { UpdateTagdetailDto } from './dto/update-tagdetail.dto';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { TagDetailRepository } from './tagdetail.repository';
import { User } from 'src/auth/entities/user.entity';
import { TagDetail } from './entities/tagdetail.entity';
import { getTagDetailsFilterDto } from './dto/get-tagdetail-filter.dto';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class TagdetailsService {
  constructor(
    private readonly tagDetailRepository: TagDetailRepository,
    private abilityFactory: AbilityFactory,
  ) {}

  //Get All(byfiltre) TagDetails
  async getTagDetails(
    filterTagDetailDto: getTagDetailsFilterDto,
    user: User,
  ): Promise<TagDetail[]> {
    return await this.tagDetailRepository.getTagDetails(
      filterTagDetailDto,
      user,
    );
  }

  //create a new TagDetail
  async createTagDetail(
    user: User,
    createTagDetailDto: CreateTagdetailDto,
  ): Promise<TagDetail> {
    return this.tagDetailRepository.createTagDetail(user, createTagDetailDto);
  }

  async getTagDetailById(id: number, user: User): Promise<TagDetail> {
    // return this.taskRepository.findOneBy({ id });
    const ability = await this.abilityFactory.defineAbility(user);
    const found = await this.tagDetailRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`TagDetail with ID "${id} is Not Found"`);
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

  async updateTagDetail(
    id: number,
    user: User,
    createTagDetailDto: CreateTagdetailDto,
  ): Promise<TagDetail> {
    const ability = await this.abilityFactory.defineAbility(user);
    const tagDetail = await this.getTagDetailById(id, user);
    const { detail_name, detail_value, have_password, deleted } =
      createTagDetailDto;
    tagDetail.detail_name = detail_name;
    tagDetail.detail_value = detail_value;
    tagDetail.have_password = have_password;
    tagDetail.deleted = deleted;

    try {
      ForbiddenError.from(ability).throwUnlessCan('update', tagDetail);
      await tagDetail.save();
      return tagDetail;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
