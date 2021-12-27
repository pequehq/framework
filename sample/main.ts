import 'reflect-metadata';

import bodyParser from 'body-parser';
import cors from 'cors';

import { ExpressFactory } from '../src';
import { TestServerGuard } from './modules/guards/test-server.guard';
import { TestRootModule } from './modules/root/test-root.module';

async function startUp() {
  await ExpressFactory.createServer({
    rootModule: TestRootModule,
    globalMiddlewares: {
      preRoutes: [bodyParser.urlencoded({ extended: true }), bodyParser.json({ limit: '2m' })],
      postRoutes: [cors],
    },
    swagger: {
      folder: '/doc',
      info: {
        title: 'Test API',
        description: 'Test API description',
        contacts: {
          name: 'Simone Di Cicco',
          email: 'simone.dicicco@gmail.com',
        },
        version: '1.0.0',
      },
      servers: [{ url: 'https://api.test.com/' }],
      tags: [
        {
          name: 'Tag',
          description: 'Description',
        },
      ],
    },
    logger: {
      consoleOutput: true,
      level: 'debug',
      active: true,
      engine: 'true',
    },
    isCpuClustered: false,
    guards: [TestServerGuard],
    showOriginalErrorObject: true,
  });
}

startUp();
