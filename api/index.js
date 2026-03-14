const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { AppModule } = require('../dist/app.module');

let expressApp;

async function bootstrap() {
  if (expressApp) return expressApp;

  expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.enableCors();

  await app.init();
  return expressApp;
}

module.exports = async function handler(req, res) {
  try {
    const app = await bootstrap();
    app(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
