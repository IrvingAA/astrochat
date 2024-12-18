import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { ApiResponse, HttpEnum, AlertEnum } from '@/common/api-response'
import { UserLoginRequest } from './dto/login.dto'
import { UserLoginResponse } from './dto/user-login.response'
import { IUser } from '@/models/user.model'
import { format } from 'date-fns'
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  /**
   * Valida las credenciales del usuario y retorna un token JWT
   * @param user {UserLoginRequest} - Datos del usuario (username y password)
   */
  async login(user: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> {
    try {
      const { username, password } = user

      const foundUser = await this.userModel
        .findOne({ username })
        .select('+password')
      if (!foundUser || !(await foundUser.comparePassword(password))) {
        throw new UnauthorizedException('Credenciales inválidas')
      }

      const payload = { username: foundUser.username, sub: foundUser._id }
      const tokenUser = this.jwtService.sign(payload)

      return new ApiResponse<UserLoginResponse>(
        HttpEnum.SUCCESS,
        'Inicio de sesión exitoso',
        AlertEnum.SUCCESS,
        'Inicio de sesión',
        {
          accessToken: {
            token: tokenUser,
            type: 'Bearer',
            expiresIn: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          },
          user: foundUser
        }
      )
    } catch (error: any) {
      console.error(error)
      return new ApiResponse<UserLoginResponse>(
        HttpEnum.BAD_REQUEST,
        'Error al iniciar sesión',
        AlertEnum.ERROR,
        'Inicio de sesión',
        error
      )
    }
  }

  /**
   * Valida si el token es válido
   */
  async validateToken(): Promise<ApiResponse<any>> {
    return new ApiResponse<any>(
      HttpEnum.SUCCESS,
      'Token válido',
      AlertEnum.SUCCESS,
      'Validación de token',
      null
    )
  }

  /**
   * Registra un nuevo usuario
   */
  async register(): Promise<ApiResponse<any>> {
    return new ApiResponse<any>(
      HttpEnum.SUCCESS,
      'Usuario registrado',
      AlertEnum.SUCCESS,
      'Registro de usuario',
      null
    )
  }
}
