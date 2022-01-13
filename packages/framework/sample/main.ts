import 'reflect-metadata';

import { PequeFactory } from '../dist';
import { TestMicroservice } from './microservices/test-microservice';
import { TestRedisMicroservice } from './microservices/test-redis-microservice';
import { TestServerGuard } from './modules/guards/test-server.guard';
import { TestRootModule } from './modules/root/test-root.module';

async function startUp() {
  const webserver = PequeFactory.createWebServer({
    rootModule: TestRootModule,
    cors: true,
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

  await webserver.start();

  // const microservice = PequeFactory.createMicroservices({ services: [TestMicroservice, TestRedisMicroservice] });
  // await microservice.start();
}

startUp();
