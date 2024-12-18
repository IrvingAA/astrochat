import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ProfilesModule } from './profiles/profiles.module'
import { ConfigModule } from '@nestjs/config'
import { WebController } from './web.controller'
import { NotFoundController } from './not-found.controller'
import { ChatRoomModule } from './chatRoom/chat-room.module'
import { GraphqlModule } from './graphql/graphql.module'
import { AuthModule } from './auth/auth.module'
import { AuthMiddleware } from './auth/auth.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(
      process.env.RUNNING_IN_DOCKER === 'true'
        ? process.env.MONGO_URI_DOCKER
        : process.env.MONGO_URI_LOCAL
    ),
    UsersModule,
    ProfilesModule,
    ChatRoomModule,
    GraphqlModule,
    AuthModule
  ],
  controllers: [AppController, WebController, NotFoundController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/auth/validate')
  }
}
