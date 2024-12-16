// src/users/users.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IUser } from '../models/user.model'
import { IProfile } from '../models/profile.model'
import { CreateUserDto } from './dto/create-user.dto'
import { PasswordUtil } from '@/common/utils/password.util'
import { ApiResponse, HttpEnum, AlertEnum } from '@/common/api-response'
import ProfileEnum from '@/enum/profile.enum'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Profile') private readonly profileModel: Model<IProfile>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<IUser>> {
    const { email, username, password } = createUserDto

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return new ApiResponse<IUser>(
        HttpEnum.CONFLICT,
        'El usuario ya existe',
        AlertEnum.ERROR,
        null
      )
    }

    const hashedPassword = await PasswordUtil.hashPassword(password)
    const defaultProfile = await this.profileModel.findOne({
      name: ProfileEnum.USER
    })

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      profile: defaultProfile._id
    })

    const savedUser = await newUser.save()

    const populatedUser = await this.userModel
      .findById(savedUser._id)
      .populate('profile')

    return new ApiResponse<IUser>(
      HttpEnum.CREATED,
      'El usuario ha sido creado con éxito',
      AlertEnum.SUCCESS,
      populatedUser,
      ['uuid', 'username', 'email', 'profile.name', 'createdAt', 'updatedAt']
    )
  }
}
