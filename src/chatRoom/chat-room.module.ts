import { Module } from '@nestjs/common'
import { ChatRoomService } from './chat-room.service'
import { ChatRoomController } from './chat-room.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatRoomSchema } from '@/models/chatRoom.model'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatRoom', schema: ChatRoomSchema }])
  ],
  providers: [ChatRoomService],
  controllers: [ChatRoomController]
})
export class ChatRoomModule {}
