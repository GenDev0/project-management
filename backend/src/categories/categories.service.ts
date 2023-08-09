import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categoryrepository } from './category.repository';
import { getCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Category } from './entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class CategoriesService {
  constructor(
    private abilityFactory: AbilityFactory,
    private readonly categoryRepository: Categoryrepository,
  ) {}

  //Get All(byfiltre) Categories
  async getCategories(
    filterCategoryDto: getCategoriesFilterDto,
    user: User,
  ): Promise<Category[]> {
    return await this.categoryRepository.getCategories(filterCategoryDto, user);
  }

  //Geta Category By Id
  async getCategoryById(id: number, user: User): Promise<Category> {
    const ability = await this.abilityFactory.defineAbility(user);
    const found = await this.categoryRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Category with ID "${id} is Not Found"`);
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

  //create a new Category
  async createCategory(
    user: User,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryRepository.createCategory(user, createCategoryDto);
  }

  //update a Category
  async updateCategory(
    id: number,
    user: User,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const ability = await this.abilityFactory.defineAbility(user);
    const { name, categoryDescription, projectId, categoryIcon, deleted } =
      updateCategoryDto;
    const category = await this.getCategoryById(id, user);
    if (name) {
      category.name = name;
    }
    if (categoryDescription) {
      category.categoryDescription = categoryDescription;
    }
    if (projectId) {
      category.projectId = projectId;
    } else {
      throw new NotFoundException('you must enter Project Id');
    }
    if (categoryIcon) {
      category.categoryIcon = categoryIcon;
    }
    if (deleted) {
      category.deleted = deleted;
    }
    try {
      ForbiddenError.from(ability).throwUnlessCan('update', category);
      await category.save();
      return category;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // create(createCategoryDto: CreateCategoryDto) {
  //   return 'This action adds a new category';
  // }

  // findAll() {
  //   return `This action returns all categories`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
