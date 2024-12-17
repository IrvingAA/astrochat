import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessagesService } from './message.service'
import { MessagesController } from './message.controller'
import { MessageSchema } from '../models/message.model'
import { UserSchema } from '../models/user.model'
import { MessageResolver } from './message.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageResolver]
})
export class MessageModule {}
