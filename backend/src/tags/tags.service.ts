import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';
import { getTagsFilterDto } from './dto/get-tags-filter.dto';
import { Tag } from './entities/tag.entity';
import { User } from 'src/auth/entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagRepository: TagRepository,
    private abilityFactory: AbilityFactory,
  ) {}

  //Get All(byfiltre) Tags
  async getTags(filterTagDto: getTagsFilterDto, user: User): Promise<Tag[]> {
    return await this.tagRepository.getTags(filterTagDto, user);
  }

  //Geta Tag By Id
  async getTagById(id: number, user: User): Promise<Tag> {
    const ability = await this.abilityFactory.defineAbility(user);

    const found = await this.tagRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Tag with ID "${id} is Not Found"`);
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

  //create a new Tag
  async createTag(createTagDto: CreateTagDto, user: User): Promise<Tag> {
    return this.tagRepository.createTag(createTagDto, user);
  }

  //update a Tag
  async updateTag(
    id: number,
    updateTagDto: CreateTagDto,
    user: User,
  ): Promise<Tag> {
    const ability = await this.abilityFactory.defineAbility(user);

    const { name, tagDescription, projectId, tagIcon, deleted } = updateTagDto;
    const tag = await this.getTagById(id, user);
    if (name) {
      tag.name = name;
    }
    if (tagDescription) {
      tag.tagDescription = tagDescription;
    }
    if (projectId) {
      tag.projectId = projectId;
    } else {
      throw new NotFoundException('you must enter Project Id');
    }
    if (tagIcon) {
      tag.tagIcon = tagIcon;
    }
    if (deleted) {
      tag.deleted = deleted;
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan('update', tag);
      await tag.save();
      return tag;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // create(createTagDto: CreateTagDto) {
  //   return 'This action adds a new tag';
  // }

  // findAll() {
  //   return `This action returns all tags`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} tag`;
  // }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
