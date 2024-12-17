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
  username: string
  name: string
  lastName: string
  email?: string
  password: string
  avatar?: string
  profile?: string
}
