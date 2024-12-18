import { IsString, IsOptional, IsBoolean } from 'class-validator'
export class UpdateChatRoomDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsString()
  totalItems?: string

  @IsOptional()
  @IsString()
  totalPages?: string
}
