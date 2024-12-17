module.exports = {
  async up(db) {
    await db.createCollection('chatrooms', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['uuid', 'name', 'isActive', 'createdAt', 'updatedAt'],
          properties: {
            uuid: { bsonType: 'string' },
            description: { bsonType: ['string', 'null'] },
            password: { bsonType: ['string', 'null'] },
            name: { bsonType: 'string' },
            isActive: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
            deletedAt: { bsonType: ['date', 'null'] }
          }
        }
      }
    })

    await db.collection('chatrooms').createIndex({ uuid: 1 }, { unique: true })
    await db.collection('chatrooms').createIndex({ isActive: 1 })
  },

  async down(db) {
    await db.collection('chatrooms').drop()
  }
}
