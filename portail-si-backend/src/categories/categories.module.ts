import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoryrepository } from './category.repository';
import { Category } from './entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, AbilityModule], //, AuthModule
  controllers: [CategoriesController],
  providers: [CategoriesService, Categoryrepository],
})
export class CategoriesModule {}
