import { Module } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { ProfilesController } from './profiles.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ProfileSchema } from '@/models/profile.model'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }])
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController]
})
export class ProfilesModule {}
