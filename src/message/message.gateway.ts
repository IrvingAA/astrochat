import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody
} from '@nestjs/websockets'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

@WebSocketGateway({ path: '/graphql' })
export class MessageGateway {
  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: string): void {
    pubSub.publish('messageAdded', { newMessage: message })
  }
}
