module.exports = {
  async up(db) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            '_id',
            'uuid',
            'username',
            'email',
            'profile',
            'name',
            'lastName',
            'password',
            'isActive'
          ],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId único para el usuario'
            },
            uuid: {
              bsonType: 'string',
              description: 'Debe ser un string único para el uuid del usuario'
            },
            username: {
              bsonType: 'string',
              description: 'Debe ser un string único para el nombre de usuario'
            },
            email: {
              bsonType: 'string',
              description: 'Debe ser un string único para el correo del usuario'
            },
            avatar: {
              bsonType: ['string', 'null'],
              description: 'URL del avatar del usuario'
            },
            profile: {
              bsonType: 'objectId',
              description:
                'Debe ser una referencia válida a la colección de perfiles'
            },
            name: {
              bsonType: 'string',
              description: 'El nombre del usuario, requerido'
            },
            lastName: {
              bsonType: 'string',
              description: 'El apellido del usuario, requerido'
            },
            password: {
              bsonType: 'string',
              description: 'Contraseña encriptada del usuario, requerida'
            },
            isActive: {
              bsonType: 'bool',
              description: 'Estado activo del usuario, requerido'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Fecha de creación del usuario, requerida'
            },
            updatedAt: {
              bsonType: 'date',
              description:
                'Fecha de ultima actualización del usuario, requerida'
            },
            deletedAt: {
              bsonType: ['date', 'null'],
              description: 'Fecha de eliminación del usuario, opcional'
            }
          }
        }
      }
    })
    await db.collection('users').createIndex({ username: 1 }, { unique: true })
    await db.collection('users').createIndex({ isActive: 1 })
  },

  async down(db) {
    await db.collection('users').drop()
  }
}
