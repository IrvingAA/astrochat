import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Put
} from '@nestjs/common'
import { ChatRoomService } from './chat-room.service'
import { CreateChatRoomDto } from './dto/create-chat-room.dto'
import { UpdateChatRoomDto } from './dto/update-chat-room.dto'
import { ApiResponse, StandardParamsPagination } from '@/common/api-response'
import { IChatRoom } from '@/models/chatRoom.model'

@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  /**
   * Method to create a chat room
   * @param {CreateChatRoomDto} createChatRoomDto
   * @returns {Promise<ApiResponse<IChatRoom>>}
   */
  @Post()
  create(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.create(createChatRoomDto)
  }

  /**
   * Method to index all chat rooms
   * @param {StandardParamsPagination} queryParams
   * @returns {Promise<ApiResponse<StandardPagination<IChatRoom[]>>}
   */
  @Get()
  async index(@Query() queryParams: StandardParamsPagination) {
    const { page, limit, search, ...otherParams } = queryParams
    const parsedPage = Number(page) || 1
    const parsedLimit = Number(limit) || 10

    return this.chatRoomService.findAll({
      page: parsedPage,
      limit: parsedLimit,
      search,
      ...otherParams
    })
  }

  /**
   * Method to update a chat room
   * @param {string} uuid
   * @param {UpdateChatRoomDto} updateChatRoomDto
   */
  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto
  ) {
    return this.chatRoomService.update(uuid, updateChatRoomDto)
  }

  /**
   * Method to delete a chat room
   * @param {string} uuid
   */
  @Delete(':uuid')
  softDelete(
    @Param('uuid') uuid: string
  ): Promise<ApiResponse<IChatRoom | null>> {
    return this.chatRoomService.softDelete(uuid)
  }

  /**
   * Method to deactivate or activate a chat room
   * @param {string} uuid
   */
  @Patch(':uuid/status')
  toggleActive(
    @Param('uuid') uuid: string
  ): Promise<ApiResponse<IChatRoom | null>> {
    return this.chatRoomService.toggleActive(uuid)
  }
}
