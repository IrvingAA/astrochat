import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Delete
} from '@nestjs/common'
import { MessagesService } from './message.service'
import { CreateMessageDto } from './dto/create-message.dto'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto)
  }

  @Get('chat-room/:id')
  async findByChatRoom(@Param('id') chatRoomId: string) {
    return this.messagesService.findByChatRoom(chatRoomId)
  }

  @Delete(':uuid')
  async softDelete(@Param('uuid') uuid: string) {
    return this.messagesService.softDelete(uuid)
  }
}
