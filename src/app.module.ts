import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/models/admin.models';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [Admin],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    AdminsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
