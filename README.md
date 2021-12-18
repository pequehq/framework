# Peque.ts

[![CircleCI](https://circleci.com/gh/ukaoskid/peque-fwork.svg?style=shield)]() 
[![codecov](https://codecov.io/gh/ukaoskid/peque-fwork/branch/main/graph/badge.svg?token=VGIM3BAZ80)](https://codecov.io/gh/ukaoskid/peque-fwork)

<img src="./docs/images/logo_blue.png" width="150">

This framework is built on-top of **Express** and is intended to provide a **standard** to help the **design**, **development**,
and **life-cycle management** of **scalable** and **efficient** server-side web application (with **Node.js**).
It can also be used to **invert the control** in a pre-existent Express application.

## Install
`npm i peque.ts`

## Documentation
[Documentation](https://www.peque.tech)

## Server
```typescript
import { TestRootModule } from './modules/root/test-root.module';
import { ExpressFactory } from 'peque.ts';

const cors = require('cors');
const bodyParser = require('body-parser');

async function startUp() {
  await ExpressFactory.createServer({
      rootModule: TestRootModule,
      globalMiddlewares: {
        preRoutes: [
          bodyParser.urlencoded({ extended: true }),
          bodyParser.json({ limit: '2m' })
        ],
        postRoutes: [cors]
      },
      swagger: {
        folder: '/doc',
        info: {
          title: 'Test API',
          description: 'Test API description',
          contacts: {
            name: 'Simone Di Cicco',
            email: 'simone.dicicco@gmail.com'
          },
          version: '1.0.0'
        },
        servers: [{ url: 'https://api.test.com/'}],
        tags: [
          {
            name: 'Tag',
            description: 'Description'
          }
        ]
      },
      isCpuClustered: false
    }
  );
}

startUp();
```

## Examples
[https://github.com/ukaoskid/peque-fwork/tree/main/sample](https://github.com/ukaoskid/peque-fwork/tree/main/sample)
