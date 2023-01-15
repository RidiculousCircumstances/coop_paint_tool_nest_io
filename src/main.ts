import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  // app.enableCors({ origin: config.get('ORIGIN') });
  app.enableCors({ origin: '*' });
  await app.listen(+config.get('APP_PORT'));
}
bootstrap();
