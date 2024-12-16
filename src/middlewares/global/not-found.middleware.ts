import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.startsWith('/api')) {
      return next()
    }

    console.log(
      `Ruta no encontrada: ${req.originalUrl}, redirigiendo a la raíz...`
    )
    res.redirect('/')
  }
}
