import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true })
  originalName: string

  @Prop({ required: true })
  hashName: string

  @Prop({ required: true })
  path: string

  @Prop({ required: true })
  mimeType: string

  @Prop({ default: false })
  isDeleted: boolean
}

export const FileSchema = SchemaFactory.createForClass(File)
