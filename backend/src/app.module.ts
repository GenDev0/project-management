import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { PrivilegesModule } from './privileges/privileges.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from './ability/ability.module';
import { TagdetailsModule } from './tagdetails/tagdetails.module';
import { DetailpasswordsModule } from './detailpasswords/detailpasswords.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ProjectsModule,
    RolesModule,
    PrivilegesModule,
    CategoriesModule,
    TagsModule,
    AbilityModule,
    TagdetailsModule,
    DetailpasswordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
