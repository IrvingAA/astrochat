import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ProfilesModule } from './profiles/profiles.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(
      process.env.RUNNING_IN_DOCKER === 'true'
        ? process.env.MONGO_URI_DOCKER
        : process.env.MONGO_URI_LOCAL,
    ),
    //MongooseModule.forRoot('mongodb://localhost:27017/astrochat'),
    UsersModule,
    ProfilesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
