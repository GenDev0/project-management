import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './tag.repository';
import { AuthModule } from 'src/auth/auth.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule, AbilityModule], //, AuthModule
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
})
export class TagsModule {}
