import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

/**
 * Data transfer object for creating a user
 * @class
 * @name CreateUserDto
 * @property {string} username - User's username
 * @property {string} name - User's name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email
 * @property {string} password - User's password
 * @property {string} avatar - User's avatar
 * @property {string} profile - User's profile
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  avatar: string

  @IsString()
  profile: string
}
