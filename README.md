# Peque.ts

![coverage](https://raw.githubusercontent.com/ukaoskid/peque-fwork/main/.badge-coverage.svg)

<center>
    <img src="https://raw.githubusercontent.com/ukaoskid/peque-fwork/main/docs/images/logo_blue.png" width="150" />
</center>

This framework is built on-top of **Express** and is intended to provide a **standard** to help the **design**, **development**,
and **life-cycle management** of **scalable** and **efficient** server-side web application (with **Node.js**).
It can also be used to **invert the control** in a pre-existent Express application.

## Install
`npm i peque.ts`

### Node version
The usage of the Node.js LTS version is required.

## Documentation
[Documentation](https://www.peque.tech)

## Server
```typescript
import { TestRootModule } from './modules/root/test-root.module';
import { PequeFactory } from 'peque.ts';

async function startUp() {
  await PequeFactory.createServer({
    cors: true,
    isCpuClustered: false,
    rootModule: TestRootModule,
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
      servers: [{ url: 'https://api.test.com/'}],
      tags: [
        {
          name: 'Tag',
          description: 'Description',
        },
      ],
    },
  });
}

startUp();
```

## Examples
[https://github.com/ukaoskid/peque-fwork/tree/main/sample](https://github.com/ukaoskid/peque-fwork/tree/main/sample)
