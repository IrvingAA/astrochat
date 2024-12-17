module.exports = {
  async up(db) {
    await db.createCollection('messages', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'uuid',
            'content',
            'chatRoomUuid',
            'senderUuid',
            'createdAt',
            'updatedAt'
          ],
          properties: {
            uuid: {
              bsonType: 'string',
              description: 'Debe ser un string y único'
            },
            content: {
              bsonType: 'string',
              description: 'Contenido del mensaje'
            },
            chatRoomUuid: {
              bsonType: 'string',
              description: 'UUID de la sala de chat'
            },
            senderUuid: {
              bsonType: 'objectId',
              description: 'ObjectId del remitente'
            },
            recipientUuid: {
              bsonType: ['objectId', 'null'],
              description:
                'ObjectId del destinatario (opcional, null para mensajes públicos)'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Fecha de creación del mensaje'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Fecha de última actualización'
            },
            deletedAt: {
              bsonType: ['date', 'null'],
              description:
                'Fecha de eliminación lógica, null si no está eliminado'
            }
          }
        }
      }
    })

    await db.collection('messages').createIndex({ uuid: 1 }, { unique: true })
    await db.collection('messages').createIndex({ chatRoomUuid: 1 })
    await db.collection('messages').createIndex({ senderUuid: 1 })
  },

  async down(db) {
    await db.collection('messages').drop()
  }
}
