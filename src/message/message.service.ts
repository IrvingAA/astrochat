import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IMessage } from '../models/message.model'
import { CreateMessageDto } from './dto/create-message.dto'
import {
  ApiResponse,
  HttpEnum,
  AlertEnum,
  StandardPagination
} from '@/common/api-response'
import { IUser } from '@/models/user.model'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<IMessage>,
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  /**
   * Create a new message (public or private)
   * @param {CreateMessageDto} createMessageDto
   * @returns {Promise<ApiResponse<IMessage>>}
   */
  async createMessage(dto: CreateMessageDto): Promise<ApiResponse<IMessage>> {
    const { chatRoomUuid, senderUuid, recipientUuid, content } = dto
    console.log('DTO:', dto)

    try {
      const sender = await this.userModel.findOne({ uuid: senderUuid })
      if (!sender) {
        return new ApiResponse<null>(
          HttpEnum.NOT_FOUND,
          'El remitente no fue encontrado',
          AlertEnum.ERROR,
          null
        )
      }
      let savedMessage = null

      let recipient = null
      if (recipientUuid) {
        recipient = await this.userModel.findOne({ uuid: recipientUuid })
        if (!recipient) {
          return new ApiResponse<null>(
            HttpEnum.NOT_FOUND,
            'El destinatario no fue encontrado',
            AlertEnum.ERROR,
            null
          )
        }
      }
      console.log('Recipient:', recipient)

      const newMessage = new this.messageModel({
        content,
        senderUuid: sender._id,
        recipientUuid: recipient ? recipient._id : null,
        chatRoomUuid
      })
      console.log('New message:', newMessage)

      try {
        savedMessage = await newMessage.save()
      } catch (error: any) {
        console.log('Error guardando el mensaje:', error.message || error)
      }

      return new ApiResponse<IMessage>(
        HttpEnum.CREATED,
        'Mensaje creado correctamente',
        AlertEnum.SUCCESS,
        savedMessage
      )
    } catch (error: any) {
      console.error('Error creando el mensaje:', error.message || error)

      return new ApiResponse<null>(
        HttpEnum.BAD_REQUEST,
        `Error creando el mensaje: ${error.message}`,
        AlertEnum.ERROR,
        null
      )
    }
  }

  /**
   * Get paginated messages in a chat room (public and private)
   * @param {string} chatRoomUuid - UUID of the chat room
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {Promise<ApiResponse<any>>} - Paginated public and private messages
   */
  async findByChatRoom(
    chatRoomUuid: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<any>> {
    try {
      const userUuid = 'b905bd9a-a158-43da-a9d6-57d630849f91'

      const user = await this.userModel.findOne({ uuid: userUuid })
      if (!user) {
        return new ApiResponse<any>(
          HttpEnum.NOT_FOUND,
          'Usuario no encontrado',
          AlertEnum.ERROR,
          []
        )
      }

      const userId = user._id
      const skip = (page - 1) * limit

      const publicMessagesQuery = this.messageModel
        .find({
          chatRoomUuid,
          recipientUuid: null,
          deletedAt: null
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 })
        .populate('senderUuid', 'uuid username fullName')
        .lean()

      const privateMessagesQuery = this.messageModel
        .find({
          chatRoomUuid,
          $or: [{ recipientUuid: userId }, { senderUuid: userId }],
          deletedAt: null
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 })
        .populate('senderUuid', 'uuid username fullName')
        .populate('recipientUuid', 'uuid username fullName')
        .lean()

      const [publicMessages, privateMessages] = await Promise.all([
        publicMessagesQuery,
        privateMessagesQuery
      ])

      const totalPublic = await this.messageModel.countDocuments({
        chatRoomUuid,
        recipientUuid: null,
        deletedAt: null
      })

      const totalPrivate = await this.messageModel.countDocuments({
        chatRoomUuid,
        $or: [{ recipientUuid: userId }, { senderUuid: userId }],
        deletedAt: null
      })

      const organizedMessages = {
        publicMessages: new StandardPagination(
          publicMessages,
          page,
          limit,
          totalPublic
        ),
        privateMessages: new StandardPagination(
          privateMessages,
          page,
          limit,
          totalPrivate
        )
      }

      return new ApiResponse<any>(
        HttpEnum.SUCCESS,
        'Mensajes obtenidos correctamente',
        AlertEnum.SUCCESS,
        organizedMessages
      )
    } catch (error: any) {
      console.error('Error obteniendo mensajes: ', error.message)
      return new ApiResponse<any>(
        HttpEnum.SERVER_ERROR,
        `Ocurrió un error al obtener los mensajes: ${error.message}`,
        AlertEnum.ERROR,
        []
      )
    }
  }

  /**
   * Soft delete a message by UUID
   * @param {string} uuid
   * @returns
   */
  async softDelete(uuid: string): Promise<ApiResponse<IMessage | null>> {
    const message = await this.messageModel.findOne({ uuid })

    if (!message) {
      return new ApiResponse<IMessage | null>(
        HttpEnum.NOT_FOUND,
        'Mensaje no encontrado',
        AlertEnum.ERROR,
        null
      )
    }

    message.deletedAt = new Date()
    await message.save()

    return new ApiResponse<IMessage>(
      HttpEnum.SUCCESS,
      'Mensaje eliminado correctamente',
      AlertEnum.SUCCESS,
      message
    )
  }
}
