import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IChatRoom } from '../models/chatRoom.model'
import { UpdateChatRoomDto } from './dto/update-chat-room.dto'
import { CreateChatRoomDto } from './dto/create-chat-room.dto'
import {
  ApiResponse,
  HttpEnum,
  AlertEnum,
  StandardPagination,
  StandardParamsPagination
} from '@/common/api-response'

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel('ChatRoom') private readonly chatRoomModel: Model<IChatRoom>
  ) {}

  async create(
    createChatRoomDto: CreateChatRoomDto
  ): Promise<ApiResponse<IChatRoom>> {
    const { name } = createChatRoomDto

    const existingRoom = await this.chatRoomModel.findOne({ name })
    if (existingRoom) {
      return new ApiResponse<IChatRoom>(
        HttpEnum.CONFLICT,
        'La sala ya existe',
        AlertEnum.ERROR,
        null
      )
    }

    const newRoom = new this.chatRoomModel(createChatRoomDto)
    const savedRoom = await newRoom.save()

    return new ApiResponse<IChatRoom>(
      HttpEnum.CREATED,
      'Sala creada con éxito',
      AlertEnum.SUCCESS,
      savedRoom
    )
  }

  async findAll(
    params: StandardParamsPagination
  ): Promise<ApiResponse<StandardPagination<IChatRoom[]>>> {
    const { page, limit, search, ...otherParams } = params

    const parsedPage = Number(page) || 1
    const parsedLimit = Number(limit) || 10

    const filter: any = search
      ? {
          $or: [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
          ],
          deletedAt: null,
          isActive: true,
          ...otherParams
        }
      : { deletedAt: null, isActive: true }

    for (const key in otherParams) {
      if (Object.prototype.hasOwnProperty.call(otherParams, key)) {
        filter[key] = otherParams[key]
      }
    }

    const skip = (parsedPage - 1) * parsedLimit
    const rooms = await this.chatRoomModel
      .find(filter)
      .skip(skip)
      .limit(parsedLimit)
      .sort({ createdAt: -1 })

    const total = await this.chatRoomModel.countDocuments(filter)

    const paginationResult = new StandardPagination<IChatRoom[]>(
      rooms,
      parsedPage,
      parsedLimit,
      total
    )

    return new ApiResponse<StandardPagination<IChatRoom[]>>(
      HttpEnum.SUCCESS,
      'Salas obtenidas correctamente',
      AlertEnum.SUCCESS,
      paginationResult,
      ['uuid', 'name', 'description', 'isActive', 'createdAt']
    )
  }

  /**
   * Update a chat room by UUID
   * @param {string} uuid - Unique identifier of the chat room
   * @param {UpdateChatRoomDto} updateChatRoomDto - DTO with fields to update
   * @returns {Promise<ApiResponse<IChatRoom | null>>} - Standardized API response
   */
  async update(
    uuid: string,
    updateChatRoomDto: UpdateChatRoomDto
  ): Promise<ApiResponse<IChatRoom | null>> {
    const existingRoom = await this.chatRoomModel.findOne({ uuid })

    if (!existingRoom) {
      return new ApiResponse<IChatRoom | null>(
        HttpEnum.NOT_FOUND,
        'Sala no encontrada',
        AlertEnum.ERROR,
        null
      )
    }

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateChatRoomDto).filter(
        ([key, value]) =>
          value !== undefined && existingRoom[key as keyof IChatRoom] !== value
      )
    ) as Partial<IChatRoom>

    if (Object.keys(fieldsToUpdate).length === 0) {
      return new ApiResponse<IChatRoom>(
        HttpEnum.SUCCESS,
        'No se realizaron cambios',
        AlertEnum.WARNING,
        existingRoom,
        ['uuid', 'name', 'description', 'isActive', 'createdBy', 'updatedAt']
      )
    }

    Object.assign(existingRoom, fieldsToUpdate)
    const updatedRoom = await existingRoom.save()

    return new ApiResponse<IChatRoom>(
      HttpEnum.SUCCESS,
      'Sala actualizada correctamente',
      AlertEnum.SUCCESS,
      updatedRoom,
      ['uuid', 'name', 'description', 'isActive', 'createdBy', 'updatedAt']
    )
  }

  /**
   * Soft delete or restore a chat room by UUID (toggle deletedAt)
   * @param {string} uuid - Unique identifier of the chat room
   * @returns {Promise<ApiResponse<IChatRoom | null>>} - Standardized API response
   */
  async softDelete(uuid: string): Promise<ApiResponse<IChatRoom | null>> {
    const room = await this.chatRoomModel.findOne({ uuid })

    if (!room) {
      return new ApiResponse<IChatRoom | null>(
        HttpEnum.NOT_FOUND,
        'Sala no encontrada',
        AlertEnum.ERROR,
        null
      )
    }

    const isDeleted = room.deletedAt !== null

    room.deletedAt = isDeleted ? null : new Date()
    const updatedRoom = await room.save()

    const message = isDeleted
      ? 'Sala restaurada correctamente'
      : 'Sala eliminada correctamente'

    return new ApiResponse<IChatRoom>(
      HttpEnum.SUCCESS,
      message,
      AlertEnum.SUCCESS,
      updatedRoom,
      ['uuid', 'name', 'description', 'isActive', 'createdBy', 'deletedAt']
    )
  }

  /**
   * Method to deactivate or activate a chat room
   * @param {uuid} uuid
   * @returns {Promise<ApiResponse<IChatRoom | null>>}
   */
  async toggleActive(uuid: string): Promise<ApiResponse<IChatRoom | null>> {
    const room = await this.chatRoomModel.findOne({ uuid })
    if (!room) {
      return new ApiResponse<IChatRoom | null>(
        HttpEnum.NOT_FOUND,
        'Sala no encontrada',
        AlertEnum.ERROR,
        room,
        ['uuid', 'name', 'description', 'isActive', 'createdBy']
      )
    }

    room.isActive = !room.isActive
    await room.save()

    return new ApiResponse<IChatRoom>(
      HttpEnum.SUCCESS,
      `Sala ${room.isActive ? 'borrada' : 'restaurada'} correctamente`,
      AlertEnum.SUCCESS,
      room,
      ['uuid', 'name', 'description', 'isActive', 'createdBy', 'deletedAt']
    )
  }
}
