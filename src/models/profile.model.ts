import { Schema, Document, Model, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IProfile extends Document {
  uuid: string
  name: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export const ProfileSchema = new Schema<IProfile>(
  {
    uuid: {
      type: String,
      unique: true,
      required: true,
      default: uuidv4
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const ProfileModel: Model<IProfile> = model<IProfile>(
  'Profile',
  ProfileSchema
)
