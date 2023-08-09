import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ForbiddenException,
  ParseIntPipe,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { DetailpasswordsService } from './detailpasswords.service';
import { CreateDetailpasswordDto } from './dto/create-detailpassword.dto';
import { UpdateDetailpasswordDto } from './dto/update-detailpassword.dto';
import { ForbiddenError } from '@casl/ability';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Detailpassword } from './entities/detailpassword.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('detailpasswords')
@UseGuards(AuthGuard())
export class DetailpasswordsController {
  constructor(
    private readonly detailpasswordsService: DetailpasswordsService,
  ) {}

  //Get All(byfiltre) Detailpasswords
  @Get()
  getDetailpasswords(@GetUser() user: User): Promise<Detailpassword[]> {
    return this.detailpasswordsService.getDetailpasswords(user);
  }

  //Get Detailpassword By ID
  @Get('/:id')
  getDetailpasswordById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Detailpassword> {
    try {
      return this.detailpasswordsService.getDetailpasswordById(id, user);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // Create a new Detailpassword
  @Post()
  @UsePipes(ValidationPipe)
  createDetailpassword(
    @GetUser() user: User,
    @Body() createDetailpasswordDto: CreateDetailpasswordDto,
  ): Promise<Detailpassword> {
    return this.detailpasswordsService.createDetailpassword(
      user,
      createDetailpasswordDto,
    );
  }

  //Update a Detailpassword
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateDetailpassword(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetailpasswordDto: CreateDetailpasswordDto,
  ): Promise<Detailpassword> {
    return this.detailpasswordsService.updateDetailpassword(
      id,
      user,
      updateDetailpasswordDto,
    );
  }
}
