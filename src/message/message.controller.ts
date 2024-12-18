import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common'
import { MessagesService } from './message.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat-room/:id')
  async findByChatRoom(@Param('id') chatRoomId: string) {
    return this.messagesService.findByChatRoom(chatRoomId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  async softDelete(@Param('uuid') uuid: string) {
    return this.messagesService.softDelete(uuid)
  }
}
