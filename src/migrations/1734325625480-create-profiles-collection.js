module.exports = {
  async up(db) {
    await db.createCollection('profiles', {
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

    await db.collection('profiles').createIndex({ uuid: 1 }, { unique: true })
    await db.collection('profiles').createIndex({ isActive: 1 })
  },

  async down(db) {
    await db.collection('profiles').drop()
  }
}
