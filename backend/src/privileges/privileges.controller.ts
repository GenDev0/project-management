import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PrivilegesService } from './privileges.service';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { Privilege } from './entities/privilege.entity';
import { PrivilegeValidationPipe } from './pipe/privilege-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('privileges')
@UseGuards(AuthGuard())
export class PrivilegesController {
  constructor(private readonly privilegesService: PrivilegesService) {}

  // Create a new Privilege
  @Post()
  @UsePipes(ValidationPipe)
  createPrivilege(
    @Body(PrivilegeValidationPipe) createPrivilegeDto: CreatePrivilegeDto,
    @GetUser() user: User,
  ): Promise<Privilege> {
    return this.privilegesService.createPrivilege(createPrivilegeDto, user);
  }

  //Get All(byfiltre) Privileges
  @Get()
  getPrivileges(
    @Body(ValidationPipe) filterPrivilegeIds: number[],
    @GetUser() user: User,
  ): Promise<Privilege[]> {
    return this.privilegesService.getPrivileges(filterPrivilegeIds, user);
  }

  //Get Privilege By ID
  @Get('/:id')
  getPrivilegeById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Privilege> {
    return this.privilegesService.getPrivilegeById(id, user);
  }

  //Update a Privilege
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updatePrivilege(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrivilegeDto: CreatePrivilegeDto,
    @GetUser() user: User,
  ): Promise<Privilege> {
    return this.privilegesService.updatePrivilege(id, updatePrivilegeDto, user);
  }

  // @Post()
  // create(@Body() createPrivilegeDto: CreatePrivilegeDto) {
  //   return this.privilegesService.create(createPrivilegeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.privilegesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.privilegesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePrivilegeDto: UpdatePrivilegeDto) {
  //   return this.privilegesService.update(+id, updatePrivilegeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.privilegesService.remove(+id);
  // }
}
