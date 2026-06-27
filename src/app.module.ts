import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './modules/blogs/blogs.module';
import { PostModule } from './modules/post/post.module';
import { TestingModule } from './modules/testing/testing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017', {
    //   dbName: 'blogger-platform',
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URL'),
        dbName: 'blogger-platform',
      }),
    }),
    BlogsModule,
    PostModule,
    UserModule,
    AuthModule,
    CommentsModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
