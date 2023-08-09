import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ForbiddenException,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TagdetailsService } from './tagdetails.service';
import { ForbiddenError } from '@casl/ability';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { getTagDetailsFilterDto } from './dto/get-tagdetail-filter.dto';
import { TagDetail } from './entities/tagdetail.entity';
import { CreateTagdetailDto } from './dto/create-tagdetail.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tagdetails')
@UseGuards(AuthGuard())
export class TagdetailsController {
  constructor(private readonly tagdetailsService: TagdetailsService) {}

  // Create a new TagDetail
  @Post()
  @UsePipes(ValidationPipe)
  createTagDetail(
    @GetUser() user: User,
    @Body() createTagDetailDto: CreateTagdetailDto,
  ): Promise<TagDetail> {
    return this.tagdetailsService.createTagDetail(user, createTagDetailDto);
  }

  //Get All(byfiltre) TagDetails
  @Get()
  getTagDetails(
    @Query(ValidationPipe) filterTagDetailDto: getTagDetailsFilterDto,
    @GetUser() user: User,
  ): Promise<TagDetail[]> {
    return this.tagdetailsService.getTagDetails(filterTagDetailDto, user);
  }

  @Get('/:id')
  getTagDetailById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TagDetail> {
    try {
      return this.tagdetailsService.getTagDetailById(id, user);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Patch('/:id')
  updateTagDetail(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() createTagDetailDto: CreateTagdetailDto,
  ): Promise<TagDetail> {
    try {
      return this.tagdetailsService.updateTagDetail(
        id,
        user,
        createTagDetailDto,
      );
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
