import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/infrastructure/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // バリデーションパイプを有効化
  app.useGlobalPipes(new ValidationPipe());

  // CORSを有効化
  app.enableCors();

  // Swaggerの設定
  const config = new DocumentBuilder()
    .setTitle('Beauty App API')
    .setDescription('美容サービス管理システムのAPIドキュメント')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users', 'ユーザー管理関連のエンドポイント')
    .addTag('services', 'サービス管理関連のエンドポイント')
    .addTag('auth', '認証関連のエンドポイント')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap(); 