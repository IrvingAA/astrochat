import { Schema, Document, Model, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

/**
 * Interfaz para la Sala de Chat
 * @interface IChatRoom
 * @extends {Document}
 * @param {string} uuid - Identificador único de la sala
 * @param {string} name - Nombre de la sala
 * @param {string} description - Descripción de la sala
 * @param {string} password - Contraseña de la sala
 * @param {boolean} isActive - Indica si la sala está activa
 * @param {string} createdBy - Identificador del usuario que creó la sala
 * @param {Date} createdAt - Fecha de creación de la sala
 * @param {Date} updatedAt - Fecha de actualización de la sala
 * @param {Date} deletedAt - Fecha de eliminación de la sala
 * @returns {Document}
 */
export interface IChatRoom extends Document {
  uuid: string
  name: string
  description?: string
  password?: string
  isActive: boolean
  createdBy?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export const ChatRoomSchema = new Schema<IChatRoom>(
  {
    uuid: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: null },
    password: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

export const ChatRoomModel: Model<IChatRoom> = model<IChatRoom>(
  'ChatRoom',
  ChatRoomSchema
)
