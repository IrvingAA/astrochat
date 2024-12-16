import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UserModel, UserSchema } from '../models/user.model'
import { ProfileModel, ProfileSchema } from '../models/profile.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }, // Modelo User
      { name: 'Profile', schema: ProfileSchema } // Modelo Profile
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
