import { Categoryrepository } from './../categories/category.repository';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import { PrivilegeRepository } from 'src/privileges/privilege.repository';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AbilityModule } from 'src/ability/ability.module';
import { Category } from 'src/categories/entities/category.entity';
import { Detailpassword } from 'src/detailpasswords/entities/detailpassword.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TagDetail } from 'src/tagdetails/entities/tagdetail.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagRepository } from 'src/tags/tag.repository';
import { TagDetailRepository } from 'src/tagdetails/tagdetail.repository';
import { Detailpasswordrepository } from 'src/detailpasswords/detailpassword.repository';
import { ProjectRepository } from 'src/projects/project.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Privilege,
      User,
      Project,
      Category,
      Tag,
      TagDetail,
      Detailpassword,
    ]),
    AuthModule,
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 36000,
      },
    }),
    AbilityModule,
  ], //, AuthModule
  controllers: [RolesController],
  providers: [
    RolesService,
    RoleRepository,
    PrivilegeRepository,
    UserRepository,
    TagRepository,
    TagDetailRepository,
    Detailpasswordrepository,
    ProjectRepository,
    Categoryrepository,
  ],
})
export class RolesModule {}
