import mongoose from 'mongoose'
import path from 'path'
import { UserModel } from '../models/user.model'
import { ProfileModel } from '../models/profile.model'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const isDockerRunning = process.env.RUNNING_IN_DOCKER === 'true'

async function seedUsers() {
  try {
    console.info('🚀 isDockerRunning:', isDockerRunning)

    const mongoUri = isDockerRunning
      ? process.env.MONGO_URI_DOCKER
      : process.env.MONGO_URI_LOCAL

    if (!mongoUri) {
      throw new Error(
        '❌ MONGO_URI no está definida en las variables de entorno.'
      )
    }

    console.info('🔗 Conectando a MongoDB con la URI:', mongoUri)

    await mongoose.connect(mongoUri)
    console.log('✅ Conectado a MongoDB - User Seeder')

    const profiles = await ProfileModel.find().limit(2)
    console.log('📋 Perfiles encontrados:', profiles)

    if (profiles.length < 2) {
      throw new Error(
        '❌ No se encontraron suficientes perfiles para relacionar.'
      )
    }

    console.log('🗑️ Limpiando colección de usuarios...')
    await UserModel.deleteMany({})
    console.log('✅ Colección de usuarios limpiada.')

    const users = [
      {
        username: 'john_doe',
        email: 'john_doe@mail.com',
        profile: profiles[0]._id,
        name: 'John',
        lastName: 'Doe',
        password: 'hashed_password_123',
        avatar: 'https://example.com/avatar1.png',
        isActive: true
      },
      {
        username: 'jane_doe',
        email: 'jane_doe@mail.com',
        profile: profiles[1]._id,
        name: 'Jane',
        lastName: 'Doe',
        password: 'hashed_password_456',
        avatar: 'https://example.com/avatar2.png',
        isActive: true
      }
    ]

    console.log('👤 Usuarios a insertar:', users)

    const result = await UserModel.insertMany(users, { ordered: true })
    console.log('✅ Usuarios insertados correctamente:', result)

    await mongoose.disconnect()
    console.log('🔌 Conexión a MongoDB cerrada.')
  } catch (error) {
    console.error('❌ Error al poblar usuarios:', error)

    try {
      await mongoose.disconnect()
      console.log('🔌 Conexión a MongoDB cerrada tras error.')
    } catch (disconnectError) {
      console.error('❌ Error al cerrar la conexión:', disconnectError)
    }
  }
}

seedUsers()
