import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { getCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';

export class Categoryrepository extends Repository<Category> {
  constructor(
    private abilityFactory: AbilityFactory,
    @InjectRepository(Category)
    private categoryrepository: Repository<Category>,
  ) {
    super(
      categoryrepository.target,
      categoryrepository.manager,
      categoryrepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  //Get All(byfiltre) Categories
  async getCategories(
    filtercategoryDto: getCategoriesFilterDto,
    user: User,
  ): Promise<Category[]> {
    const ability = await this.abilityFactory.defineAbility(user);

    const { search } = filtercategoryDto;
    const query = this.categoryrepository.createQueryBuilder('category');

    if (search) {
      query.andWhere(
        '(category.name Like :search OR category.categoryDescription Like :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const categories = await query.getMany();
    let accessible_categories = [];

    categories.forEach((category) => {
      if (ability.can('read', category)) {
        accessible_categories.push(category);
      }
    });

    return accessible_categories;
  }

  // create a new Tag
  async createCategory(
    user: User,
    createTagDto: CreateCategoryDto,
  ): Promise<Category> {
    const ability = await this.abilityFactory.defineAbility(user);
    const { name, categoryDescription, projectId, categoryIcon, deleted } =
      createTagDto;
    const category = new Category();
    category.name = name;
    category.categoryDescription = categoryDescription;
    category.projectId = projectId;

    if (categoryIcon) {
      category.categoryIcon = categoryIcon;
    }
    if (deleted) {
      category.deleted = deleted;
    }
    try {
      ForbiddenError.from(ability).throwUnlessCan('create', 'Category');
      await category.save();

      return category;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
