import mongoose, { Schema, Document, model, Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IMessage extends Document {
  uuid: string
  content: string
  chatRoomUuid: string
  senderUuid: mongoose.Types.ObjectId | any
  recipientUuid?: mongoose.Types.ObjectId | any | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export const MessageSchema = new Schema<IMessage>(
  {
    uuid: { type: String, default: uuidv4 },
    content: { type: String, required: true },
    chatRoomUuid: { type: String, required: true },
    senderUuid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientUuid: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

export const MessageModel: Model<IMessage> = model<IMessage>(
  'Message',
  MessageSchema
)
