import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import { GqlContextType } from '@nestjs/graphql'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType<GqlContextType>()

    if (contextType === 'graphql') {
      return this.handleGraphQLException(exception)
    }

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    if (status === HttpStatus.NOT_FOUND) {
      return response.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>404 - Not Found</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: Arial, sans-serif;
              background-color: #1a202c;
              color: #ffffff;
            }
            h1 {
              font-size: 3rem;
              text-align: center;
            }
            p {
              color: #cbd5e0;
            }
            span {
              color: #e53e3e;
            }
          </style>
        </head>
        <body>
          <div>
            <h1><span>404</span> - Página No Encontrada</h1>
            <p>Lo sentimos, pero la ruta que intentas acceder no existe.</p>
          </div>
        </body>
        </html>
      `)
    }

    response.status(status).json({
      statusCode: status,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url
    })
  }

  /**
   * Manejo de excepciones para GraphQL
   * @param exception
   */
  private handleGraphQLException(exception: any) {
    throw exception
  }
}
