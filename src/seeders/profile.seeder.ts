import mongoose from 'mongoose'
import { ProfileModel } from '../models/profile.model'

const profiles = [
  { name: 'Profile 1', isActive: true },
  { name: 'Profile 2', isActive: true }
]

async function seedProfiles() {
  try {
    await mongoose.connect('mongodb://localhost:27017/astrochat')
    console.log('Conectado a MongoDB - Profile Seeder')

    await ProfileModel.deleteMany({})
    console.log('Colección de perfiles limpiada.')

    const result = await ProfileModel.insertMany(profiles)
    console.log('Perfiles insertados correctamente:', result)

    await mongoose.disconnect()
    console.log('Conexión a MongoDB cerrada.')
  } catch (error) {
    console.error('Error al poblar perfiles:', error)
  }
}

seedProfiles()
