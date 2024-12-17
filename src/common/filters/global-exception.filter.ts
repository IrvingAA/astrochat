import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Response } from 'express'
import { ApiResponse, HttpEnum, AlertEnum } from '../api-response'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Ocurrió un error inesperado.'
    let alert: AlertEnum = AlertEnum.ERROR

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const responseMessage = exception.getResponse()
      message =
        typeof responseMessage === 'object'
          ? (responseMessage as any).message || 'Error'
          : responseMessage
    }

    if (exception instanceof Error && (exception as any).code === 11000) {
      status = HttpStatus.CONFLICT
      const keyValue = (exception as any).keyValue
      const duplicateField = Object.keys(keyValue).join(', ')
      message = `El valor proporcionado para ${duplicateField} ya existe.`
      alert = AlertEnum.ERROR
    }

    const apiResponse = new ApiResponse(
      status as HttpEnum,
      message,
      alert,
      null,
      undefined,
      new Date().toISOString()
    )

    response.status(status).json(apiResponse)
  }
}
