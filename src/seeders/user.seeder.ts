import mongoose from 'mongoose'
import { UserModel } from '../models/user.model'
import { ProfileModel } from '../models/profile.model'

async function seedUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/astrochat')
    console.log('Conectado a MongoDB - User Seeder')

    const profiles = await ProfileModel.find().limit(2)
    console.log('Perfiles encontrados:', profiles)

    if (profiles.length < 2) {
      throw new Error('No se encontraron suficientes perfiles para relacionar.')
    }

    console.log('Limpiando colección de usuarios...')
    await UserModel.deleteMany({})
    console.log('Colección de usuarios limpiada.')

    console.log('Insertando usuarios...')
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

    console.log('Usuarios a insertar:', users)
    try {
      console.log('Usuarios a insertar:', users)
      const result = await UserModel.insertMany(users, { ordered: true })
      console.log('Usuarios insertados correctamente:', result)
    } catch (error: any) {
      console.error('Error al insertar usuarios:', error.message)
    }

    await mongoose.disconnect()
    console.log('Conexión a MongoDB cerrada.')
  } catch (error) {
    console.error('Error al poblar usuarios:', error)
    await mongoose.disconnect()
  }
}

seedUsers()
