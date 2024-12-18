import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiResponse } from '@/common/api-response'
import { HttpEnum, AlertEnum } from '@/common/api-response'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    console.log('Request:', request.url)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse: any = exception.getResponse()

    const formattedResponse = new ApiResponse(
      HttpEnum.BAD_REQUEST,
      exceptionResponse.message || 'Error desconocido',
      AlertEnum.ERROR,
      'Error',
      null,
      undefined,
      new Date().toISOString()
    )

    response.status(status).json(formattedResponse)
  }
}
