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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { getTagsFilterDto } from './dto/get-tags-filter.dto';
import { Tag } from './entities/tag.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tags')
@UseGuards(AuthGuard())
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  //Get All(byfiltre) Tags
  @Get()
  getTags(
    @Query(ValidationPipe) filterTagDto: getTagsFilterDto,
    @GetUser() user: User,
  ): Promise<Tag[]> {
    return this.tagsService.getTags(filterTagDto, user);
  }

  //Get Tag By ID
  @Get('/:id')
  getTagById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Tag> {
    return this.tagsService.getTagById(id, user);
  }

  // Create a new Tag
  @Post()
  @UsePipes(ValidationPipe)
  createTag(
    @Body() createTagDto: CreateTagDto,
    @GetUser() user: User,
  ): Promise<Tag> {
    return this.tagsService.createTag(createTagDto, user);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: CreateTagDto,
    @GetUser() user: User,
  ): Promise<Tag> {
    return this.tagsService.updateTag(id, updateTagDto, user);
  }

  // @Post()
  // create(@Body() createTagDto: CreateTagDto) {
  //   return this.tagsService.create(createTagDto);
  // }

  // @Get()
  // findAll() {
  //   return this.tagsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagsService.update(+id, updateTagDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagsService.remove(+id);
  // }
}
