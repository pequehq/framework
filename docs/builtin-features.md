---
title: Built-in features
has_children: false
nav_order: 12
---

## Built-in features
The framework comes out with a list of built-in providers and aspects ready to implemented:

| Feature                 | Type      | Description                                                                                                                                          |
|-------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **HttpClient**          | Provider  | A full HTTP client based on the package Axios.                                                                                                       | 
| **HttpEventService**    | Provider  | Provides an subscription to the incoming request for async purposes such as logging or other tasks not related to a response. The service uses rxjs. |
| **MemoryStoreService**  | Provider  | Internal key-value memory storage at runtime with TTL.                                                                                               |
| **EventManagerService** | Provider  | It provides an internal event system, it is also where the framework events can be hooked.                                                           |
| **SchedulerService**    | Provider  | It provides an internal cron system.                                                                                                                 |
| **LoggerService**       | Provider  | It provides an internal pipeline for logging.                                                                                                        |
| **Cacheable**           | Decorator | A method decorator that leverages the custom `CacheService` to cache the result of the decorated method.                                             |
| **ConsumeEvent**        | Decorator | A method decorator that shall call the registered method at specified event time.                                                                    |
| **ProduceEvent**        | Decorator | A method decorator that shall produce the specified event with the decorated method result.                                                          |
| **Scheduler**           | Decorator | A method decorator that shall call the registered method at specified cron expression.                                                               |
| **GetWebSocketServer**  | Decorator | Injects the current created WebSocket server.                                                                                                        |

## Event management service
It is based on Node.js `EventEmitter`, and it provides a ready to use out-of-the-box implementation.
The framework is also leveraging this service internally to dispatch native events that can also be hooked by developers for design purposes.

| Native event                      | Description              |
|-----------------------------------|--------------------------|
| `http.in`                         | Incoming HTTP request    |
| `http.out`                        | Response towards client  |
| `logger`                          | Logging events           |
| `scheduler`                       | Logging events           |
| `lifecycle.bootstrap`             | Server bootstrap         |
| `lifecycle.init.provider`         | Injectable init          |
| `lifecycle.init.module`           | Module init              |
| `lifecycle.init.controller`       | Controllers init         |
| `lifecycle.init.websocket`        | WebSocket server init    |
| `lifecycle.server.listening`      | Server listening         |
| `lifecycle.server.started`        | Server started           |
| `lifecycle.destroy.controller`    | Controller destroyed     |
| `lifecycle.destroy.module`        | Module destroyed         |
| `lifecycle.destroy.provider`      | Injectable destroyed     |
| `lifecycle.destroy.websocket`     | WebSocket server destroy |
| `lifecycle.server.listening.stop` | Server listener closed   |
| `lifecycle.server.shutdown`       | Server shutdown          |

The Event Management System, besides the injectable `EventManagementService`, is also providing a set of decorators:
- `@OnEvent(event: string | NativeEventType)`

```typescript
@Injectable()
export class InternalService {
  constructor(private readonly eventManager: EventManagerService) { }

  @OnEvent(event)
  consumeEvent(data: EventData) {
    console.log(data);
  }
}
```

## Logger service
It is a simple service where to route all the logs. This service is also used internally by the framework so that the developers
can make use of the internal logs as well.

It provides four level of logs, and the log level can be defined in the `Server` config.
The logs will be evaluated based on the expression `config.level >= log.level`.

| Level   | Order  |
|---------|--------|
| `debug` | 1      |
| `error` | 2      |
| `warn`  | 3      |
| `info`  | 4      |



```typescript
@Injectable()
export class InternalService {
  constructor(private readonly loggerService: LoggerService) { }
  
  doSomething() {
    this.loggerService().log({ level: 'info', data: { test: 'test message' } });
  }
}
```

## Scheduler service
It is based on the package [`node-cron`](https://www.npmjs.com/package/node-cron), and it allows the execution of methods at a specified time.
The schedule is provided by this decorator:
- `@Scheduler(name: string, cron: string)`

```typescript
@Injectable()
export class InternalService {
  constructor() { }

  @Scheduler('doSomething', '*/5 * * * * *')
  doSomething() {
    console.log('Scheduled method');
  }
}
```

The tasks can also be managed via the `ScheduleService` itself.
```typescript
@Injectable()
export class InternalService {
  constructor(private readonly schedulerService: SchedulerService) { }

  @Scheduler('doSomething', '*/5 * * * * *')
  doSomething() {
    console.log('Scheduled method');
  }
  
  stopDoSomething() {
    this.schedulerService.getScheduler('doSomething').stop();
  }
}
```
