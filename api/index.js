const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const serverlessExpress = require('@vendia/serverless-express');
const express = require('express');

let cachedHandler;

async function bootstrap() {
  if (cachedHandler) return cachedHandler;

  const { AppModule } = require('../dist/app.module');
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.enableCors();

  await app.init();
  cachedHandler = serverlessExpress({ app: expressApp });
  return cachedHandler;
}

module.exports = async function handler(req, res) {
  const serverlessHandler = await bootstrap();
  return serverlessHandler(req, res);
};
