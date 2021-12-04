# Peque.ts

[![CircleCI](https://circleci.com/gh/ukaoskid/peque-fwork.svg?style=shield)]()
[![codecov](https://codecov.io/gh/ukaoskid/peque-fwork/branch/main/graph/badge.svg?token=VGIM3BAZ80)](https://codecov.io/gh/ukaoskid/peque-fwork)
1
This framework is intended to provide a **standard** to help the **design**, **development**,
and **life-cycle management** of **scalable** and **efficient** server-side web application (with **Node.js**).
It can also be used to **invert the control** in a pre-existent Express application.
 
It is built on-top of **Express** and intended to be used with TypeScript even if JavaScript can still be used.
It delivers paradigms such as Object Oriented Programming (**OOP**), Aspect Oriented Programming (**AOP**),
Functional Programming (**FP**), and Dependency Injection (**DI**).

Built in house, it provides full control over knowledge, evolution, life-cycle, and dependency management.

## Install
`npm i peque.ts`

## Server

```typescript
import 'reflect-metadata';
import { TestRootModule } from './modules/root/test-root.module';
import { ExpressFactory } from '../src/factory/express-factory';

const cors = require('cors');
const bodyParser = require('body-parser');

async function startUp() {
  const expressServer = ExpressFactory.createServer({
      rootModule: TestRootModule,
      globalMiddlewares: {
        preRoutes: [
          bodyParser.urlencoded({extended: true}),
          bodyParser.json({limit: '2m'})
        ],
        postRoutes: [cors]
      },
      isCpuClustered: false
    }
  );
}
startUp();
```

## Examples
[https://github.com/ukaoskid/peque-fwork/tree/main/sample](https://github.com/ukaoskid/peque-fwork/tree/main/sample)
