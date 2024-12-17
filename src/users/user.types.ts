import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserType {
  @Field(() => String)
  uuid: string

  @Field(() => String, { nullable: true })
  username?: string

  @Field(() => String, { nullable: true })
  fullName?: string
}
