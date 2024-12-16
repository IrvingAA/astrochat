import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

export const multerConfig = {
  storage: diskStorage({
    destination: './storage/uploads',
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname)
      const fileName = `${uuidv4()}${fileExtension}`
      cb(null, fileName)
    }
  })
}
