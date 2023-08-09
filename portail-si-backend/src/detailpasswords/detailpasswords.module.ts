import { Module } from '@nestjs/common';
import { DetailpasswordsService } from './detailpasswords.service';
import { DetailpasswordsController } from './detailpasswords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { AuthModule } from 'src/auth/auth.module';
import { Detailpassword } from './entities/detailpassword.entity';
import { Detailpasswordrepository } from './detailpassword.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Detailpassword]),
    AuthModule,
    AbilityModule,
  ],
  controllers: [DetailpasswordsController],
  providers: [DetailpasswordsService, Detailpasswordrepository],
})
export class DetailpasswordsModule {}
