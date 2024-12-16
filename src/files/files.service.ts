import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { File } from './schemas/file.schema'

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async saveFileData(file: Express.Multer.File): Promise<File> {
    const newFile = new this.fileModel({
      originalName: file.originalname,
      hashName: file.filename,
      path: file.path,
      mimeType: file.mimetype
    })
    return newFile.save()
  }

  async getFileById(id: string): Promise<File> {
    return this.fileModel.findById(id)
  }

  async softDeleteFile(id: string): Promise<void> {
    await this.fileModel.findByIdAndUpdate(id, { isDeleted: true })
  }
}
