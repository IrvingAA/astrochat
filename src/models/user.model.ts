import mongoose, { Schema, Document, Model, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
  uuid: string
  username: string
  name: string
  lastName: string
  email: string | null
  password: string
  profile: mongoose.Types.ObjectId
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  fullName?: string
}

export const UserSchema = new Schema<IUser>(
  {
    uuid: { type: String, default: uuidv4 },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)
UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.name} ${this.lastName}`.trim()
})

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema)