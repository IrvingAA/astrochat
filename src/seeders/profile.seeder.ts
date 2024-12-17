import mongoose from 'mongoose'
import path from 'path'
import { ProfileModel } from '../models/profile.model'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const hasDockerRunning = process.env.RUNNING_IN_DOCKER === 'true'

const profiles = [
  { name: 'Profile 1', isActive: true },
  { name: 'Profile 2', isActive: true }
]

async function seedProfiles() {
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
    console.log('✅ Conectado a MongoDB - Profile Seeder')

    await ProfileModel.deleteMany({})
    console.log('🗑️ Colección de perfiles limpiada.')

    const result = await ProfileModel.insertMany(profiles)
    console.log('✅ Perfiles insertados correctamente:', result)

    await mongoose.disconnect()
    console.log('🔌 Conexión a MongoDB cerrada.')
  } catch (error) {
    console.error('❌ Error al poblar perfiles:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedProfiles()
