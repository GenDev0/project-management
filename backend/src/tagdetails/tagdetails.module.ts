import { Module } from '@nestjs/common';
import { TagdetailsService } from './tagdetails.service';
import { TagdetailsController } from './tagdetails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { AuthModule } from 'src/auth/auth.module';
import { TagDetail } from './entities/tagdetail.entity';
import { TagDetailRepository } from './tagdetail.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagDetail]), AuthModule, AbilityModule],
  controllers: [TagdetailsController],
  providers: [TagdetailsService, TagDetailRepository],
})
export class TagdetailsModule {}
