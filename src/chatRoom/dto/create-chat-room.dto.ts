import { IsString, IsOptional } from 'class-validator'

export class CreateChatRoomDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string
}
