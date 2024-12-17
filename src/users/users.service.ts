import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IUser } from '../models/user.model'
import { IProfile } from '../models/profile.model'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PasswordUtil } from '@/common/utils/password.util'
import {
  ApiResponse,
  HttpEnum,
  AlertEnum,
  StandardPagination,
  StandardParamsPagination
} from '@/common/api-response'
import ProfileEnum from '@/enum/profile.enum'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Profile') private readonly profileModel: Model<IProfile>
  ) {}

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto): Promise<ApiResponse<IUser>> {
    const { email, username, password } = createUserDto

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return new ApiResponse<IUser>(
        HttpEnum.CONFLICT,
        'El usuario o correo ya existe',
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
      [
        'uuid',
        'username',
        'fullName',
        'email',
        'profile.name',
        'createdAt',
        'updatedAt'
      ]
    )
  }

  /**
   * Index for all users, receives pagination parameters
   * @param {StandardParamsPagination} params
   * @returns
   */
  async findAll(
    params: StandardParamsPagination
  ): Promise<ApiResponse<StandardPagination<IUser[]>>> {
    const { page, limit, search, ...otherParams } = params

    const parsedPage = Number(page) || 1
    const parsedLimit = Number(limit) || 10

    const filter: any = search
      ? {
          $or: [
            { username: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
          ]
        }
      : {}

    for (const key in otherParams) {
      if (Object.prototype.hasOwnProperty.call(otherParams, key)) {
        filter[key] = otherParams[key]
      }
    }

    const skip = (parsedPage - 1) * parsedLimit
    const users = await this.userModel
      .find(filter)
      .populate('profile')
      .skip(skip)
      .limit(parsedLimit)

    const total = await this.userModel.countDocuments(filter)

    const paginationResult = new StandardPagination<IUser[]>(
      users,
      parsedPage,
      parsedLimit,
      total
    )

    return new ApiResponse<StandardPagination<IUser[]>>(
      HttpEnum.SUCCESS,
      'Usuarios obtenidos correctamente',
      AlertEnum.SUCCESS,
      paginationResult,
      ['uuid', 'username', 'email', 'fullName', 'profile.name']
    )
  }

  /**
   * Update a user by UUID
   * @param {string} uuid
   * @param {UpdateUserDto} updateUserDto
   * @returns {ApiResponse<IUser | null>}
   */
  async update(
    uuid: string,
    updateUserDto: UpdateUserDto
  ): Promise<ApiResponse<IUser | null>> {
    const existingUser = await this.userModel.findOne({ uuid })

    if (!existingUser) {
      return new ApiResponse<IUser | null>(
        HttpEnum.NOT_FOUND,
        'Usuario no encontrado',
        AlertEnum.ERROR,
        null
      )
    }

    if (updateUserDto.profile) {
      const profile = await this.profileModel.findOne({
        uuid: updateUserDto.profile
      })

      if (!profile) {
        return new ApiResponse<IUser | null>(
          HttpEnum.NOT_FOUND,
          'Perfil no encontrado',
          AlertEnum.ERROR,
          null
        )
      }
      ;(updateUserDto as any).profile = profile._id
    }

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateUserDto).filter(([key, value]) => {
        return value !== undefined && existingUser[key as keyof IUser] !== value
      })
    ) as Partial<IUser>

    if (Object.keys(fieldsToUpdate).length === 0) {
      return new ApiResponse<IUser>(
        HttpEnum.SUCCESS,
        'No se realizaron cambios',
        AlertEnum.WARNING,
        existingUser,
        ['uuid', 'username', 'email', 'fullName', 'profile.name', 'updatedAt']
      )
    }

    Object.assign(existingUser, fieldsToUpdate)
    const updatedUser = await existingUser.save()

    const populatedUser = await this.userModel
      .findById(updatedUser._id)
      .populate('profile')

    return new ApiResponse<IUser>(
      HttpEnum.SUCCESS,
      'Usuario actualizado correctamente',
      AlertEnum.SUCCESS,
      populatedUser,
      ['uuid', 'username', 'email', 'fullName', 'profile.name', 'updatedAt']
    )
  }

  /**
   * Soft delete or restore a user by UUID (toggle deletedAt)
   * @param {string} uuid
   * @returns {ApiResponse<IUser | null>}
   */
  async softRemove(uuid: string): Promise<ApiResponse<IUser | null>> {
    const existingUser = await this.userModel.findOne({ uuid })

    if (!existingUser) {
      return new ApiResponse<IUser | null>(
        HttpEnum.NOT_FOUND,
        'Usuario no encontrado',
        AlertEnum.ERROR,
        null
      )
    }

    const isDeleted = existingUser.deletedAt !== null
    existingUser.deletedAt = isDeleted ? null : new Date()

    const updatedUser = await existingUser.save()

    const message = isDeleted
      ? 'Usuario restaurado correctamente'
      : 'Usuario eliminado correctamente'

    return new ApiResponse<IUser>(
      HttpEnum.SUCCESS,
      message,
      AlertEnum.SUCCESS,
      updatedUser,
      ['uuid', 'username', 'email', 'fullName', 'profile.name', 'deletedAt']
    )
  }

  /**
   * Deactivate or activate a user by UUID (toggle isActive)
   * @param {string} uuid
   * @returns {ApiResponse<IUser | null>}
   *
   */
  async toggleActive(uuid: string): Promise<ApiResponse<IUser | null>> {
    const existingUser = await this.userModel.findOne({ uuid })

    if (!existingUser) {
      return new ApiResponse<IUser | null>(
        HttpEnum.NOT_FOUND,
        'Usuario no encontrado',
        AlertEnum.ERROR,
        null
      )
    }

    existingUser.isActive = !existingUser.isActive

    const updatedUser = await existingUser.save()

    const message = existingUser.isActive
      ? 'Usuario activado correctamente'
      : 'Usuario desactivado correctamente'

    return new ApiResponse<IUser>(
      HttpEnum.SUCCESS,
      message,
      AlertEnum.SUCCESS,
      updatedUser,
      ['uuid', 'username', 'email', 'fullName', 'profile.name', 'isActive']
    )
  }
}
