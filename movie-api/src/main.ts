import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //decorator가 없는 property의 object 를 거르는 역할
    forbidNonWhitelisted: true, //이상한걸 보내면 request자체를 막음
    transform: true, //유저들이 보낸 정보를 실제 사용하고자하는 타입으로 변경
  }));
  await app.listen(3000);
}
bootstrap();
