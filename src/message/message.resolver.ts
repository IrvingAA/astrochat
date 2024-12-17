import { Query, Resolver, Args, Subscription, Mutation } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { MessagesService } from './message.service'
import { GraphQLMessagePagination, GraphQLMessage } from './message.type'
import { CreateMessageDto } from './dto/create-message.dto'

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
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<GraphQLMessagePagination> {
    const response = await this.messagesService.findByChatRoom(
      chatRoomUuid,
      page,
      limit
    )

    const publicMessages = response.data.publicMessages.items || []
    const privateMessages = response.data.privateMessages.items || []

    const allMessages = [...publicMessages, ...privateMessages].map(
      (message) => ({
        id: message._id?.toString() || '',
        content: message.content || '',
        chatRoomUuid: message.chatRoomUuid || '',
        senderUuid: message.senderUuid?.uuid || '',
        recipientUuid: message.recipientUuid?.uuid || '',
        createdAt: message.createdAt || new Date().toISOString(),
        updatedAt: message.updatedAt || new Date().toISOString()
      })
    )

    return {
      items: allMessages,
      pagination: {
        currentPage: page,
        perPage: limit,
        totalItems:
          response.data.publicMessages.pagination.totalItems +
          response.data.privateMessages.pagination.totalItems,
        totalPages: Math.ceil(
          (response.data.publicMessages.pagination.totalItems +
            response.data.privateMessages.pagination.totalItems) /
            limit
        )
      }
    }
  }

  @Subscription(() => String, { name: 'newMessage' })
  newMessage() {
    return pubSub.asyncIterableIterator('messageAdded') // Escucha eventos publicados en "messageAdded"
  }

  // Mutación que envía un nuevo mensaje
  @Mutation(() => String)
  addMessage(@Args('message') message: string): string {
    pubSub.publish('messageAdded', { newMessage: message }) // Publica el evento
    return message
  }
}
