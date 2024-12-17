import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
export class CreateMessageDto {
  @Field()
  @IsString()
  chatRoomUuid: string

  @Field()
  @IsString()
  senderUuid: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recipientUuid?: string

  @Field()
  @IsString()
  content: string
}
