import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const name = process.argv[2]

if (!name) {
  console.error(
    'Por favor, proporciona el nombre del objeto: npx make:objects <nombre>'
  )
  process.exit(1)
}

const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
const baseDir = path.join(__dirname, '..', 'src')

const templates = {
  model: {
    path: `${baseDir}/models/${name}.model.ts`,
    content: `import mongoose, { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface I${capitalized} extends Document {
  uuid: string
  name: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

const ${capitalized}Schema = new Schema<I${capitalized}>(
  {
    uuid: { type: String, unique: true, required: true, default: uuidv4 },
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

export const ${capitalized}Model = model<I${capitalized}>('${capitalized}', ${capitalized}Schema)
`
  },
  migration: {
    path: `${baseDir}/migrations/${Date.now()}-create-${name}s-collection.js`,
    content: `module.exports = {
  async up(db) {
    await db.createCollection('${name}s', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['uuid', 'name', 'isActive', 'createdAt', 'updatedAt'],
          properties: {
            uuid: { bsonType: 'string' },
            name: { bsonType: 'string' },
            isActive: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
            deletedAt: { bsonType: ['date', 'null'] }
          }
        }
      }
    })

    await db.collection('${name}s').createIndex({ uuid: 1 }, { unique: true })
    await db.collection('${name}s').createIndex({ isActive: 1 })
  },

  async down(db) {
    await db.collection('${name}s').drop()
  }
}
`
  },
  seeder: {
    path: `${baseDir}/seeders/${name}.seeder.ts`,
    content: `import mongoose from 'mongoose'
import { ${capitalized}Model } from '../models/${name}.model'

const ${name}s = [
  { uuid: 'uuid1', name: '${capitalized} 1', isActive: true },
  { uuid: 'uuid2', name: '${capitalized} 2', isActive: true }
]

async function seed${capitalized}s() {
  try {
    await mongoose.connect('mongodb://localhost:27017/astrochat')

    await ${capitalized}Model.deleteMany({})
    console.log('Colección limpiada.')

    await ${capitalized}Model.insertMany(${name}s)
    console.log('Datos insertados.')

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error al poblar:', error)
  }
}

seed${capitalized}s()
`
  }
}

Object.entries(templates).forEach(([type, file]) => {
  fs.mkdirSync(path.dirname(file.path), { recursive: true })
  fs.writeFileSync(file.path, file.content, 'utf8')
  console.log(`${type} creado: ${file.path}`)
})
