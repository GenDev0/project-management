import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { TagDetail } from './entities/tagdetail.entity';
import { CreateTagdetailDto } from './dto/create-tagdetail.dto';
import { getTagDetailsFilterDto } from './dto/get-tagdetail-filter.dto';

export class TagDetailRepository extends Repository<TagDetail> {
  constructor(
    private abilityFactory: AbilityFactory,
    @InjectRepository(TagDetail)
    private tagDetailRepository: Repository<TagDetail>,
  ) {
    super(
      tagDetailRepository.target,
      tagDetailRepository.manager,
      tagDetailRepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Get All(byfiltre) TagDetails
  async getTagDetails(
    filterTagDetailDto: getTagDetailsFilterDto,
    user: User,
  ): Promise<TagDetail[]> {
    const ability = await this.abilityFactory.defineAbility(user);

    const { search } = filterTagDetailDto;
    const query = this.tagDetailRepository.createQueryBuilder('tagDetail');

    if (search) {
      query.andWhere(
        '(tagDetail.detail_name Like :search OR tagDetail.detail_value Like :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const tagDetails = await query.getMany();
    let accessible_tagDetails = [];

    tagDetails.forEach((tagDetail) => {
      if (ability.can('read', tagDetail)) {
        accessible_tagDetails.push(tagDetail);
      }
    });

    return accessible_tagDetails;
  }

  // create a new TagDetail
  async createTagDetail(
    user: User,
    createTagDetailDto: CreateTagdetailDto,
  ): Promise<TagDetail> {
    const ability = await this.abilityFactory.defineAbility(user);
    const {
      detail_name,
      detail_value,
      have_password,
      projectId,
      tag_id,
      deleted,
    } = createTagDetailDto;
    const tagDetail = new TagDetail();
    tagDetail.detail_name = detail_name;
    tagDetail.detail_value = detail_value;
    tagDetail.have_password = have_password;
    tagDetail.projectId = projectId;
    tagDetail.deleted = tag_id;
    tagDetail.deleted = deleted;
    console.log(tagDetail);

    try {
      ForbiddenError.from(ability).throwUnlessCan('create', 'TagDetail');
      await tagDetail.save();
      return tagDetail;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
