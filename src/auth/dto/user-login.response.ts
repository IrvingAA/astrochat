import { UserType } from '@/users/user.types'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserLoginResponse {
  @Field(() => String)
  accessToken: TokenIC
  user: UserType
}

@ObjectType()
export class TokenIC {
  @Field(() => TokenIC)
  type: string
  token: string
  expiresIn: string
}
