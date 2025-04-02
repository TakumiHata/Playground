import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // バリデーションパイプを有効化
  app.useGlobalPipes(new ValidationPipe());

  // CORSを有効化
  app.enableCors();

  // Swaggerの設定
  const config = new DocumentBuilder()
    .setTitle('Beauty App API')
    .setDescription('The Beauty App API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap(); 