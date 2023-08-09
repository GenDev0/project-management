import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { getTagsFilterDto } from './dto/get-tags-filter.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { User } from 'src/auth/entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';

export class TagRepository extends Repository<Tag> {
  constructor(
    private abilityFactory: AbilityFactory,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {
    super(
      tagRepository.target,
      tagRepository.manager,
      tagRepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Get All(byfiltre) Tags
  async getTags(filterTagDto: getTagsFilterDto, user: User): Promise<Tag[]> {
    const ability = await this.abilityFactory.defineAbility(user);

    const { search } = filterTagDto;
    const query = this.tagRepository.createQueryBuilder('tag');

    if (search) {
      query.andWhere(
        '(tag.name Like :search OR tag.tagDescription Like :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const tags = await query.getMany();

    let accessible_tags = [];

    tags.forEach((tag) => {
      if (ability.can('read', tag)) {
        accessible_tags.push(tag);
      }
    });

    return accessible_tags;
  }

  // create a new Tag
  async createTag(createTagDto: CreateTagDto, user: User): Promise<Tag> {
    const ability = await this.abilityFactory.defineAbility(user);

    const { name, tagDescription, projectId, categoryId, tagIcon, deleted } =
      createTagDto;
    const tag = new Tag();
    tag.name = name;
    tag.tagDescription = tagDescription;
    tag.projectId = projectId;
    tag.categoryId = categoryId;
    if (tagIcon) {
      tag.tagIcon = tagIcon;
    }
    if (deleted) {
      tag.deleted = deleted;
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan('create', 'Tag');
      await tag.save();

      return tag;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
