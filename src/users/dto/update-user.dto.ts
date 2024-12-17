import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsUUID
} from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsUUID()
  profile?: string
}
