import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class GraphQLMessage {
  @Field(() => String)
  id: string

  @Field(() => String)
  content: string

  @Field(() => String)
  chatRoomUuid: string

  @Field(() => String, { nullable: true })
  senderUuid?: string

  @Field(() => String, { nullable: true })
  recipientUuid?: string

  @Field(() => String)
  createdAt: string

  @Field(() => String)
  updatedAt: string

  @Field(() => String, { nullable: true })
  avatar?: string
}

@ObjectType()
class GraphQLPaginationMeta {
  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  perPage: number

  @Field(() => Int)
  totalItems: number

  @Field(() => Int)
  totalPages: number
}

@ObjectType()
export class GraphQLMessagePagination {
  @Field(() => [GraphQLMessage])
  items: GraphQLMessage[]

  @Field(() => GraphQLPaginationMeta)
  pagination: GraphQLPaginationMeta
}

@ObjectType()
export class ApiMessageResponse {
  @Field(() => String)
  status: string

  @Field(() => String)
  message: string

  @Field(() => String)
  alert: string

  @Field(() => GraphQLMessage)
  data: GraphQLMessage
}
