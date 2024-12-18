import { Field } from '@nestjs/graphql'
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
  SUCCESS = 'positive',
  ERROR = 'negative',
  WARNING = 'warning'
}

/**
 * Parámetros estándar de paginación con búsqueda y soporte para campos adicionales.
 * @property {number} page - Página actual
 * @property {number} limit - Cantidad de elementos por página
 * @property {string} search - Texto de búsqueda
 * @property {string} [key] - Campos adicionales
 */
export interface StandardParamsPagination {
  page: number | string
  limit: number | string
  search?: string
  [key: string]: any
}

/**
 * Estándar de paginación de la API
 * @typeParam T Tipo de dato que se espera en la respuesta
 */
export class StandardPagination<T> {
  items: T
  pagination: {
    currentPage: number
    perPage: number
    totalItems: number
    totalPages: number
  }

  constructor(items: T, page: number, perPage: number, totalItems: number) {
    this.items = items
    this.pagination = {
      currentPage: page,
      perPage: perPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / perPage)
    }
  }
}
/**
 * Estándar de respuesta de la API
 * @typeParam T Tipo de dato que se espera en la respuesta
 * @property {HttpEnum} httpCode - Código HTTP de la respuesta
 * @property {string} message - Mensaje de la respuesta
 * @property {string} title - Titulo de la alerta
 * @property {AlertEnum} alert - Tipo de alerta de la respuesta
 * @property {T | T[] | null} data - Datos a devolver
 * @property {string} dateTime - Fecha y hora de la respuesta
 * @property {function} filterFields - Filtra los campos de los datos a devolver
 * @property {function} isStandardPagination - Verifica si los datos son de paginación estándar
 * @property {function} applyFilterToItems - Aplica el filtro a los elementos de la paginación
 * @property {function} pickFields - Selecciona los campos a devolver
 * @property {function} getNestedValue - Obtiene el valor de un campo anidado
 */
export class ApiResponse<T> {
  public httpCode: HttpEnum
  public message: string
  public title?: string = 'Alerta'
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
   * @param title Titulo de la alerta
   */
  constructor(
    httpCode: HttpEnum,
    message: string,
    alert: AlertEnum,
    title: string,
    data: T | T[] | null,
    fields?: string[],
    dateTime: string = format(new Date(), 'dd-MM-yyyy HH:mm:ss ')
  ) {
    this.httpCode = httpCode
    this.message = message
    this.alert = alert
    this.title = title
    this.dateTime = dateTime
    this.data = this.filterFields(data, fields)
  }

  /**
   * Filtra los campos de los datos a devolver
   * @param data Datos a filtrar
   * @param fields Lista de campos a filtrar. Permite notación con puntos para campos anidados (e.g. "profile.name").
   * @returns
   */
  private filterFields(
    data: T | T[] | null,
    fields?: string[]
  ): T | T[] | null {
    if (!data) return null
    if (!fields || fields.length === 0) return data

    return this.isStandardPagination(data)
      ? {
          items: this.applyFilterToItems(data.items, fields),
          pagination: data.pagination
        }
      : Array.isArray(data)
        ? (data.map((item) => this.pickFields(item, fields)) as T[])
        : this.pickFields(data, fields)
  }

  /**
   * Verifica si los datos son de paginación estándar
   * @param data
   * @returns
   */
  private isStandardPagination(data: any): data is StandardPagination<any> {
    return data && data.items !== undefined && data.pagination !== undefined
  }

  /**
   * Aplica el filtro a los elementos de la paginación
   * @param {items} items
   * @param {fields} fields
   * @returns
   */
  private applyFilterToItems(items: any[], fields: string[]): any[] {
    return items.map((item) => this.pickFields(item, fields))
  }

  /**
   * Selecciona los campos a devolver
   * @param {obj} obj
   * @param {fields} fields
   * @returns
   */
  private pickFields(obj: any, fields: string[]): any {
    const filtered: any = {}
    for (const field of fields) {
      const parts = field.split('.')
      const value = this.getNestedValue(obj, parts)
      if (value !== undefined) filtered[parts.join('_')] = value
    }
    return filtered
  }

  /**
   * Obtiene el valor de un campo anidado
   * @param {obj} obj
   * @param {parts} parts
   * @returns
   */
  private getNestedValue(obj: any, parts: string[]): any {
    let current = obj
    for (const part of parts) {
      if (current == null || current[part] === undefined) return undefined
      current = current[part]
    }
    return current
  }
}

/**
 * Clonamos ApiResponse pero decoramos con @ObjectType de GraphQL
 */
export class ApiMessageResponse {
  @Field(() => String)
  message: string

  @Field(() => String)
  createdBy: string

  @Field(() => String)
  createdAt: string
}
