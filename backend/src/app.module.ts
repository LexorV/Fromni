import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './resources/users/users.module';
import * as dotenv from 'dotenv';
import configs from './config/config';
import { ConfigModule } from '@nestjs/config';
import { CampaignsModule } from './campaigns/campaigns.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(configs().database.dbUri),
    UsersModule,
    ConfigModule.forRoot({
      load: [configs],
    }),
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
