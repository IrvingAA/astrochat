import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  Res
} from '@nestjs/common'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerConfig } from '../config/multer.config'
import { Response } from 'express'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const savedFile = await this.filesService.saveFileData(file)
    return {
      success: true,
      message: 'Archivo subido correctamente',
      fileId: savedFile._id
    }
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.getFileById(id)

    if (!file || file.isDeleted) {
      return res.status(404).json({ message: 'Archivo no encontrado' })
    }

    res.sendFile(file.path, { root: '.' })
  }
}
