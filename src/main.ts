import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configuration } from './config';
import { setup } from './setup';

async function bootstrap() {
  const config = configuration();
  const app = await NestFactory.create(AppModule);
  setup(app, config.origins);
  if (config.swagger) {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Vecteron Backend API').setDescription('Public website content and protected administration API').setVersion('1.0').addBearerAuth().build());
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(config.port);
}
void bootstrap();
