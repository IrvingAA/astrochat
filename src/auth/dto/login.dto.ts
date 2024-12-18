import { IsString, IsNotEmpty } from 'class-validator'

export class UserLoginRequest {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string
}
