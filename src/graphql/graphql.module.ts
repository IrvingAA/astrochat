import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { DirectiveLocation, GraphQLDirective } from 'graphql'
import { upperDirectiveTransformer } from '@/common/directives/upper-case.directive'
import { MessageModule } from '@/message/message.module'
import { join } from 'path'
@Module({
  imports: [
    MessageModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'schema.gql'),
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION]
          })
        ]
      },
      playground: true,
      debug: true
    })
  ]
})
export class GraphqlModule {}
