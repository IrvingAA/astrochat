import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { ChatRoomModel } from '../models/chatRoom.model'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const hasDockerRunning = process.env.RUNNING_IN_DOCKER === 'true'

const chatRooms = [
  {
    name: 'General',
    description: 'Sala de chat general para todo tipo de temas.',
    isActive: true
  },
  {
    name: 'Noticias',
    description: 'Sala de chat para compartir noticias de actualidad.',
    isActive: true
  },
  {
    name: 'Deportes',
    description: 'Sala de chat para hablar sobre deportes.',
    isActive: true
  },
  {
    name: 'Espectáculos',
    description: 'Sala de chat para hablar sobre espectáculos.',
    isActive: true
  },
  {
    name: 'Tecnología',
    description: 'Sala de chat para hablar sobre tecnología.',
    isActive: true
  },
  {
    name: 'Política',
    description: 'Sala de chat para hablar sobre política.',
    isActive: true
  },
  {
    name: 'Juegos',
    description: 'Sala de chat para hablar sobre videojuegos.',
    isActive: true
  },
  {
    name: 'Música',
    description: 'Sala de chat para hablar sobre música.',
    isActive: true
  },
  {
    name: 'Cine',
    description: 'Sala de chat para hablar sobre cine.',
    isActive: true
  },
  {
    name: 'Libros',
    description: 'Sala de chat para hablar sobre libros.',
    isActive: true
  }
]

async function seedChatRooms() {
  try {
    const mongoUri = hasDockerRunning
      ? process.env.MONGO_URI_DOCKER
      : process.env.MONGO_URI_LOCAL

    if (!mongoUri) {
      throw new Error(
        'No se encontró una URI válida para MongoDB en las variables de entorno.'
      )
    }

    console.info('Conectando a MongoDB con la URI:', mongoUri)

    await mongoose.connect(mongoUri)
    console.log('Conectado a MongoDB - ChatRoom Seeder')

    await ChatRoomModel.deleteMany({})
    console.log('Colección de salas de chat limpiada.')

    const result = await ChatRoomModel.insertMany(chatRooms)
    console.log('Salas de chat insertadas correctamente:', result)

    await mongoose.disconnect()
    console.log('Conexión a MongoDB cerrada.')
  } catch (error) {
    console.error('Error al poblar:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedChatRooms()
