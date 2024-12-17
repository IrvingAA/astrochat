import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Put
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { StandardParamsPagination } from '@/common/api-response'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Method to create a user
   * @param createUserDto
   * @returns
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  /**
   * Method to index all users
   * @param {StandardParamsPagination} queryParams
   * @returns {Promise<ApiResponse<IUser[]>>}
   */
  @Get()
  async index(@Query() queryParams: StandardParamsPagination) {
    const { page, limit, search, ...otherParams } = queryParams
    const parsedPage = Number(page) || 1
    const parsedLimit = Number(limit) || 10

    return this.usersService.findAll({
      page: parsedPage,
      limit: parsedLimit,
      search,
      ...otherParams
    })
  }

  /**
   * Method to update a user
   * @param {string} uuid
   * @param {UpdateUserDto} updateUserDto
   */
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(uuid, updateUserDto)
  }

  /**
   * Method to delete a user
   * @param {string} uuid
   */
  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    return this.usersService.softRemove(uuid)
  }

  /**
   * Method to deactivate or activate a user by UUID
   * @param {string} uuid
   * @param {boolean} status
   * @returns {ApiResponse<IUser | null>}
   */
  @Patch(':uuid/status')
  async changeStatus(@Param('uuid') uuid: string) {
    return this.usersService.toggleActive(uuid)
  }
}
