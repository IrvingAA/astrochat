import { Query, Resolver, Args, Subscription, Mutation } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { MessagesService } from './message.service'
import { GraphQLMessagePagination } from './message.type'

const pubSub = new PubSub()

@Resolver()
export class MessageResolver {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Get messages by chat room
   */
  @Query(() => GraphQLMessagePagination, { name: 'messagesByChatRoom' })
  async getMessages(
    @Args('chatRoomUuid') chatRoomUuid: string,
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 50 }) limit: number
  ): Promise<GraphQLMessagePagination> {
    const response = await this.messagesService.findByChatRoom(
      chatRoomUuid,
      page,
      limit
    )

    const allMessages = response.data.items || []

    const totalItems = response.data.pagination.totalItems || 0
    const totalPages = Math.ceil(totalItems / limit)

    return {
      items: allMessages.map((message) => ({
        id: message._id?.toString() || '',
        content: message.content || '',
        chatRoomUuid: message.chatRoomUuid || '',
        senderUuid: message.senderUuid?.uuid || '',
        avatar: message.senderUuid?.avatar || '',
        recipientUuid: message.recipientUuid?.uuid || '',
        createdAt: message.createdAt || new Date().toISOString(),
        updatedAt: message.updatedAt || new Date().toISOString()
      })),
      pagination: {
        currentPage: page,
        perPage: limit,
        totalItems: totalItems,
        totalPages: totalPages
      }
    }
  }

  /**
   * Mutación: Enviar un nuevo mensaje
   */
  @Mutation(() => String, { name: 'addMessage' })
  async addMessage(
    @Args('content') content: string,
    @Args('chatRoomUuid') chatRoomUuid: string,
    @Args('senderUuid') senderUuid: string
  ): Promise<string> {
    const savedMessage: any = await this.messagesService.createMessage({
      content,
      chatRoomUuid,
      senderUuid,
      recipientUuid: null
    })
    if (!savedMessage) {
      throw new Error('Error guardando el mensaje')
    }
    const payload = {
      message: savedMessage.data.content,
      createdBy: savedMessage.data.senderUuid?.toString(),
      createdAt: savedMessage.data.createdAt?.toISOString()
    }

    pubSub.publish('messageAdded', { newMessage: JSON.stringify(payload) })

    return `Mensaje enviado: ${savedMessage.data.content}`
  }

  /**
   * Suscripción: Escuchar nuevos mensajes
   */
  @Subscription(() => String, { name: 'newMessage' })
  newMessage() {
    return pubSub.asyncIterableIterator('messageAdded')
  }
}
