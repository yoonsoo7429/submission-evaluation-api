import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVariables } from './common/const/env.const';
import { StudentModule } from './student/student.module';
import { SubmissionModule } from './submission/submission.module';
import { RevisionModule } from './revision/revision.module';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // DB
        DB_HOST: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        // AZURE_BLOB
        AZURE_CONNECTION_STRING: Joi.string().required(),
        AZURE_CONTAINER: Joi.string().required(),
        AZURE_ACCOUNT_NAME: Joi.string().required(),
        AZURE_ACCOUNT_KEY: Joi.string().required(),
        // AZURE_OPENAI
        AZURE_OPENAI_ENDPOINT: Joi.string().uri().required(),
        AZURE_OPENAI_KEY: Joi.string().required(),
        AZURE_OPENAI_DEPLOYMENT: Joi.string().required(),
        AZURE_OPENAI_API_VERSION: Joi.string().required(),
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(envVariables.dbHost),
        port: configService.get<number>(envVariables.dbPort),
        username: configService.get<string>(envVariables.dbUsername),
        password: configService.get<string>(envVariables.dbPassword),
        database: configService.get<string>(envVariables.dbDatabase),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        // synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    StudentModule,
    SubmissionModule,
    RevisionModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
