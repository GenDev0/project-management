import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory/ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagDetail } from 'src/tagdetails/entities/tagdetail.entity';
import { Detailpassword } from 'src/detailpasswords/entities/detailpassword.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Category } from 'src/categories/entities/category.entity';

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
  ],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
