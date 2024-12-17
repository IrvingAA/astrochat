import { ObjectType, Field, Int } from '@nestjs/graphql'
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
 * Estructura de paginación estándar adaptada a GraphQL.
 */
@ObjectType()
export class GraphQLPagination {
  @Field(() => Int, { description: 'Página actual' })
  currentPage: number

  @Field(() => Int, { description: 'Elementos por página' })
  perPage: number

  @Field(() => Int, { description: 'Total de elementos' })
  totalItems: number

  @Field(() => Int, { description: 'Total de páginas' })
  totalPages: number

  constructor(currentPage: number, perPage: number, totalItems: number) {
    this.currentPage = currentPage
    this.perPage = perPage
    this.totalItems = totalItems
    this.totalPages = Math.ceil(totalItems / perPage)
  }
}

/**
 * Respuesta estándar adaptada a GraphQL con paginación.
 */
@ObjectType()
export class GraphQLStandardPagination<T> {
  @Field(() => [Object], { description: 'Lista de elementos paginados' })
  items: T[]

  @Field(() => GraphQLPagination, { description: 'Metadatos de paginación' })
  pagination: GraphQLPagination

  constructor(items: T[], page: number, perPage: number, totalItems: number) {
    this.items = items
    this.pagination = new GraphQLPagination(page, perPage, totalItems)
  }
}

/**
 * Respuesta estándar adaptada a GraphQL con metadatos adicionales.
 */
@ObjectType()
export class ApiResponseGraphQL<T> {
  @Field(() => Int, { description: 'Código HTTP de la respuesta' })
  httpCode: number

  @Field(() => String, { description: 'Mensaje de la respuesta' })
  message: string

  @Field(() => String, { description: 'Tipo de alerta' })
  alert: string

  @Field(() => [Object], { nullable: true, description: 'Datos a devolver' })
  data: T | null

  @Field(() => String, { description: 'Fecha y hora de la respuesta' })
  dateTime: string

  constructor(
    httpCode: HttpEnum,
    message: string,
    alert: AlertEnum,
    data: T | null = null,
    dateTime: string = format(new Date(), 'dd-MM-yyyy HH:mm:ss')
  ) {
    this.httpCode = httpCode
    this.message = message
    this.alert = alert
    this.data = data
    this.dateTime = dateTime
  }
}
