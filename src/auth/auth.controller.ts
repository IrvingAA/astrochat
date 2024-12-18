import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserLoginRequest } from './dto/login.dto'
import { ApiResponse } from '@/common/api-response'
import { UserLoginResponse } from './dto/user-login.response'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() userLoginRequest: UserLoginRequest
  ): Promise<ApiResponse<UserLoginResponse>> {
    return this.authService.login(userLoginRequest)
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken() {
    return this.authService.validateToken()
  }

  @Get()
  async register() {
    return this.authService.validateToken()
  }
}
