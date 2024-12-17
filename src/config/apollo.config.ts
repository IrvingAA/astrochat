import { ApolloClient, InMemoryCache } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000/graphql')

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/graphql',
  options: {
    reconnect: true
  },
  client: socket
})

export const apolloClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
})
