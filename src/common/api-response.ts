import { format } from 'date-fns'

export enum HttpEnum {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500
}

export enum AlertEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}

/**
 * Estándar de respuesta de la API
 * @typeParam T Tipo de dato que se espera en la respuesta
 */
export class ApiResponse<T> {
  public httpCode: HttpEnum
  public message: string
  public alert: AlertEnum
  public data: T | T[] | null
  public dateTime: string

  /**
   * @param httpCode Código HTTP de la respuesta
   * @param message Mensaje de la respuesta
   * @param alert Tipo de alerta de la respuesta
   * @param data Datos a devolver
   * @param fields Lista de campos a filtrar. Permite notación con puntos para campos anidados (e.g. "profile.name").
   * @param dateTime Fecha y hora de la respuesta, por defecto fecha actual formateada
   */
  constructor(
    httpCode: HttpEnum,
    message: string,
    alert: AlertEnum,
    data: T | T[] | null,
    fields?: string[],
    dateTime: string = format(new Date(), 'dd-MM-yyyy hh:mm:ss a')
  ) {
    this.httpCode = httpCode
    this.message = message
    this.alert = alert
    this.dateTime = dateTime
    this.data = this.filterFields(data, fields)
  }

  private filterFields(
    data: T | T[] | null,
    fields?: string[]
  ): T | T[] | null {
    if (!data) return null
    if (!fields || fields.length === 0) return data
    if (Array.isArray(data)) {
      return data.map((item) => this.pickFields(item, fields)) as T[]
    }
    return this.pickFields(data, fields)
  }

  private pickFields(obj: any, fields: string[]): any {
    const filtered: any = {}
    for (const field of fields) {
      const parts = field.split('.')
      const value = this.getNestedValue(obj, parts)
      if (value !== undefined) {
        const newKey = parts.join('_')
        filtered[newKey] = value
      }
    }
    return filtered
  }

  private getNestedValue(obj: any, parts: string[]): any {
    let current = obj
    for (const part of parts) {
      if (current == null || current[part] === undefined) {
        return undefined
      }
      current = current[part]
    }
    return current
  }
}
