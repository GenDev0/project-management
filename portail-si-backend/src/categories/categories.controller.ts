import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { getCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Category } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ForbiddenError } from '@casl/ability';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //Get All(byfiltre) Categories
  @Get()
  getCategories(
    @Query(ValidationPipe) filterCategoryDto: getCategoriesFilterDto,
    @GetUser() user: User,
  ): Promise<Category[]> {
    return this.categoriesService.getCategories(filterCategoryDto, user);
  }

  //Get Category By ID
  @Get('/:id')
  getCategoryById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    try {
      return this.categoriesService.getCategoryById(id, user);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // Create a new Category
  @Post()
  @UsePipes(ValidationPipe)
  createCategory(
    @GetUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(user, createCategoryDto);
  }

  //Update a Category
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, user, updateCategoryDto);
  }

  // @Post()
  // create(@Body() createCategoryDto: CreateCategoryDto) {
  //   return this.categoriesService.create(createCategoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.categoriesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoriesService.remove(+id);
  // }
}
