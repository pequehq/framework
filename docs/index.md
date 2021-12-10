# Peque.ts

This framework is built on-top of **Express** and is intended to provide a **standard** to help the **design**, **development**,
and **life-cycle management** of **scalable** and **efficient** server-side web application (with **Node.js**).
It can also be used to **invert the control** in a pre-existent Express application.

## <a name="toc"></a>Table of contents
- [Install](#install)
- [General architecture](#architecture)
- [Lifecycle](#lifecycle)
  - [Interface hooks](#lifecycle-interface)
  - [Event hooks](#lifecycle-events)
  - [Start stage lifecycle](#lifecycle-start)
  - [Stop stage lifecycle](#lifecycle-stop)
- [Modules](#modules)
- [Controllers](#controllers)
  - [Routings](#controllers-routings)
  - [Middlewares](#controllers-middlewares)
- [Providers](#providers)
  - [Dependency injection](#providers-di)
  - [Custom providers](#providers-custom)
- [Swagger](#swagger)
  - [Tag](#swagger-tag)
  - [Response](#swagger-response)
  - [Component](#swagger-component)
  - [Request body](#swagger-reqbody)
  - [Parameter](#swagger-parameter)
  - [Security schema](#swagger-secschema)
  - [Property](#swagger-property)
- [Build-in features](#builtin-features)
  - [Event management service](#builtin-events)
  - [Logging service](#builtin-logger)
  - [Scheduler service](#builtin-scheduler)

## <a name="install"></a>Install <a href="#toc"><img src="images/backtop.png" width="20"/></a>
`npm i peque.ts`

## <a name="architecture"></a>General architecture <a href="#toc"><img src="images/backtop.png" width="20"/></a>
![General architecture](images/arch.png)

## <a name="lifecycle"></a>Lifecycle <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The framework give you access also to lifecycle events. They can be hooked via interfaces and/or via the Event Manager Service.
![](images/lifecycle.png)

### <a name="lifecycle-interface"></a>Interface hooks <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The interface hooks allows the developer to control the lifecycle synchronously where possible, hence, utilize `async/await` statements to wait for processes through stepping in the lifecycle.

### <a name="lifecycle-events"></a>Event hooks <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The lifecycle is also firing asynchronous events that can be consumed at developer will and in separate providers implementations.

### <a name="lifecycle-start"></a>Start stage lifecycle <a href="#toc"><img src="images/backtop.png" width="20"/></a>
| What                 | Interface           | Interface type | Event                        |
|----------------------|---------------------|----------------|------------------------------|
| **Server bootstrap** | `OnServerBootstrap` | All            | `lifecycle.bootstrap`        |
| **Provider init**    | `OnProviderInit`    | Injectables    | `lifecycle.init.provider`    |
| **Module init**      | `OnModuleInit`      | Modules        | `lifecycle.init.module`      |
| **Controller init**  | `OnControllerInit`  | Controllers    | `lifecycle.init.controller`  | 
| **Server listening** | `OnServerListen`    | All            | `lifecycle.server.listening` |
| **Server started**   | `OnServerStarted`   | All            | `lifecycle.server.started`   |

### <a name="lifecycle-stop"></a>Stop stage lifecycle <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The stop stage will refer to the `SIGINT`, `SIGTERM`, `SIGBREAK`, `SIGHUP` signals.
Please read the Node.js process signal event [documentation](https://nodejs.org/api/process.html#process_signal_events) to understand which of them are available in your OS.

| What                     | Interface              | Interface type | Event                             |
|--------------------------|------------------------|----------------|-----------------------------------|
| **Controller destroy**   | `OnControllerDestroy`  | Controllers    | `lifecycle.destroy.controller`    |
| **Module destroy**       | `OnModuleDestroy`      | Modules        | `lifecycle.destroy.module`        |
| **Provider destriy**     | `OnProviderDestroy`    | Injectables    | `lifecycle.destroy.provider`      |
| **Server listener stop** | `OnServerListenStop`   | All            | `lifecycle.server.listening.stop` | 
| **Server shutdown**      | `OnServerShutdown`     | All            | `lifecycle.server.shutdown`       |

## <a name="architecture"></a>General architecture <a href="#toc"><img src="images/backtop.png" width="20"/></a>
![General architecture](images/arch.png)

### Swagger self generation
![Swagger architecture](images/swagger-arch.png)

## <a name="modules"></a>Modules <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The modules are classes with the necessary metadata in order to define the structure of the application.
They can import other modules and define its controller.
An application must have at least one root module (a module importing all the other modules).

![Modules](images/modules.png)

The Modules are decorated with the `@Module()` decorator that is necessary to define its metadata (other modules or controllers).
```typescript
@Module({
  modules: [RandomModule],
  controllers: [TestController],
  providers: [
    HttpService,
    ExternalTestService,
    TestRootService
  ]
})
export class TestRootModule { }
```

## <a name="controllers"></a>Controllers <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The controllers are the components designated to handle the incoming **requests** and to return **responses** to the client.

![Controllers](images/controllers.png)

### <a name="controllers-routings"></a>Routings <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The `@Controller()` decorator is required together with the route argument (`/test`) in order to define a controller.
The `@Get()` decorator is the handler for a specific endpoint of the controller. Its argument is defining the final route `/test/hellow-world`
```typescript
@Controller('/test')
export class TestController {
  constructor() {
  }
  
  @Get('/hello-world')
  async helloWorld() {
    return { test: 'hello world' };
  }
}
```

Of course, the framework give access to all the standard methods as well:
- `@Get()`
- `@Post()`
- `@Put()`
- `@Patch()`
- `@Delete()`

Decorators to intercept directly the content of the **response** and the **request** are available:

| Decorator               | Description                          |
|-------------------------|--------------------------------------|
| `@Request()`            | The entire `express.Request` object  |
| `@Response()`           | The entire `express.Response` object |
| `@Param(key?: string)`  | `req.params` or `req.params[key]`    | 
| `@Query(key?: string)`  | `req.params` or `req.query[key]`     |
| `@Header(key?: string)` | `req.headers` or `req.headers[key]`  |
| `@Body()`               | `req.body`                           |
| `@Session()`            | `req.session`                        |

### <a name="controllers-middlewares"></a>Middlewares <a href="#toc"><img src="images/backtop.png" width="20"/></a>
Middlewares can be injected as **single** or **array** at controller time or HTTP method time.
They are always called **before** the endpoint handler.

![Middlewares](images/middlewares.png)

The middlewares placed at Controller time are applied for **all the routes** that belongs to the controller itself:
- `@Controller('/path', middlewareFunction)`
The middlewares placed at HTTP method time are applied for the **single route**:
- `@Get('/endpoint', [functionOne, functionTwo])`

```typescript
@Controller('/test', middlewareFunction)
export class TestController {
  constructor() {
  }
  
  @Get('/hello-world', [functionOne, functionTwo])
  async helloWorld() {
    return { test: 'hello world' };
  }
}
```

## <a name="providers"></a>Providers <a href="#toc"><img src="images/backtop.png" width="20"/></a>
A provider **injects** dependencies establishing relationships within objects.
Most of the classes inside a project can be handled as providers, like: services, factories, repositories, and like.

![Providers](images/providers.png)

### <a name="providers-di"></a>Dependency injection <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The framework leverages the **dependency injection** pattern.
It makes classes injectable by using the decorator `@Injectable()` and injects them with the decorator `@Inject()` or directly in the constructor without the `@Inject()` decorator, but just the Provider class typing.
```typescript
@Injectable()
export class ExternalTestService {
  constructor(private readonly httpService: HttpService) {
  }

  async getExternalCall() {
    const httpTest = await this.httpService.get({
      query: {
        param1: 'externaTest',
        param2: 12345
      },
      url: 'https://httpbin.org/get',
    });
    return { test: 'hello world', result: httpTest };
  }
}
```

The providers are finally resolved by the framework and returned as **singletons**, means returning the **existing instance** (if it has already been requested elsewhere) in the **property** that has been decorated with `@Inject()`.
```typescript
@Controller('/test')
export class TestController {
  constructor(private readonly externalService: ExternalTestService) {
  }
  
  @Get('/hello-world')
  async helloWorld() {
    return { test: 'hello world' };
  }
  
  @Get('/external')
  async external() {
    return { external: this.externalService.getExternalCall() };
  }
}
```

### <a name="providers-custom"></a>Custom providers <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The providers can also be custom in the case we want to cover it with an abstract class and inject it with different implementations.
The `providers` metadata in `@Module()` can either be a specific provider or a custom mapping.

```typescript
@Module({
  modules: [RandomModule],
  controllers: [TestController],
  providers: [
    { provider: CacheManager, useClass: RedisService }
  ]
})
export class TestRootModule { }
```

You can inject custom providers also via the @Injectable({ interface: CustomProvider }) decorator.
```typescript
@Injectable({ interface: CacheManager })
class RedisService implements CacheManager {}
```

## <a name="swagger"></a>Swagger (OpenAPI) <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The key concept is to avoid or to maintain the Swagger (**OpenAPI**) document manually as less as possible.
For this purpose, the framework provides a set of decorators that enables the definition of the metadata for the automatic generation of the OpenAPI document.

![](images/tommy-shelby-mad.gif)

### <a name="swagger-tag"></a>Tag <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The tags object allows the paths (endpoints) to be **arranged** into named groups in the Swagger document.
The decorator `@SwaggerTag()` provides the definition of the metadata for a `@Controller()` to do so.
```typescript
@SwaggerTag(['Test'])
@Controller('/test')
export class TestController {
  
}
```

### <a name="swagger-response"></a>Response <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The response object contains all the **information** about an endpoint.
The decorator `@SwaggerResponse()` provides the definition of the metadata for a decorated HTTP Method `@Get()` and the others to do so.
```typescript
@SwaggerTag(['Test'])
@Controller('/test')
export class TestController {
  @SwaggerResponse({
    summary: 'Hello World',
    operationId: 'helloWorld',
    parameters: []
  }, [
    {
      statusCode: 200,
      object: HelloWorldDto,
      content: 'application/json; charset=utf-8',
      description: 'Hello World returned'
    }
  ])
  @Get('/hello-world')
  async helloWorld(): HelloWorldDto {
    return { test: 'hello world' };
  }
}
```

### <a name="swagger-component"></a>Component <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The component object contains all the **properties** about a response **DTO**.
The decorator `@SwaggerComponents()` provides the definition of the metadata for a DTO class.
```typescript
@SwaggerComponent()
export class HelloWorldDto {
  @SwaggerDtoProperty({ type: 'string' })
  test: string;
}
```

### <a name="swagger-reqbody"></a>Request body <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The request body object contains all the **properties** about a request **DTO**.
The decorator `@SwaggerRequestBody()` provides the definition of the metadata for a DTO class.
```typescript
@SwaggerRequestBody()
export class LogAppendDto {
  @SwaggerDtoProperty({ type: 'string', enum: ['START', 'QUIT'] })
  eventType: string;

  @SwaggerDtoProperty({ type: 'number' })
  timestamp: number;
}
```

### <a name="swagger-parameter"></a>Parameter <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The parameter object contains all the **properties** needed to express a parameter, and it must implement the interface `SwaggerSecSchemaDefinition`
The decorator **@SwaggerParameter()** provides the definition of the metadata for a parameter class.
```typescript
@SwaggerParameter()
export class EchoParameterDto implements SwaggerSecSchemaDefinition {
  @SwaggerDtoProperty({ type: 'string' })
  echo: string;
}
```

### <a name="swagger-secschema"></a>Security schema <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The security schema object contains all the **properties** needed to express a security schema, and it must implement the interface `SwaggerSecSchemaDefinition`
The decorator `@SwaggerSecSchema()` provides the definition of the metadata for a parameter class.
```typescript
@SwaggerSecuritySchema()
export class BearerAuthSecSchema implements SwaggerSecSchemaDefinition {

}
```

### <a name="swagger-property"></a>Property <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The decorator `@SwaggerDtoProperty()` provides the definition of the metadata for **properties** that belongs only to classes decorated with:
- `@SwaggerComponent()`
- `@SwaggerRequestBody()`
- `@SwaggerParameter()`
- `@SwaggerSecuritySchema()`

## <a name="builtin-features"></a>Built-in features <a href="#toc"><img src="images/backtop.png" width="20"/></a>
The framework comes out with a list of built-in providers and aspects ready to implemented:

| Feature                 | Type      | Description                                                                                                                                          |
|-------------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **HttpService**         | Provider  | A full HTTP client based on the package got.                                                                                                         | 
| **HttpEventService**    | Provider  | Provides an subscription to the incoming request for async purposes such as logging or other tasks not related to a response. The service uses rxjs. |
| **MemoryStoreService**  | Provider  | Internal key-value memory storage at runtime with TTL.                                                                                               |
| **EventManagerService** | Provider  | It provides an internal event system, it is also where the framework events can be hooked.                                                           |
| **SchedulerService**    | Provider  | It provides an internal cron system.                                                                                                                 |
| **LoggerService**       | Provider  | It provides an internal pipeline for logging.                                                                                                        |
| **Cacheable**           | Decorator | A method decorator that leverages the custom `CacheService` to cache the result of the decorated method.                                             |
| **OnEvent**             | Decorator | A method decorator that shall call the registered method at specified event time.                                                                    |
| **Scheduler**           | Decorator | A method decorator that shall call the registered method at specified cron expression.                                                               |

### <a name="builtin-events"></a>Event management service <a href="#toc"><img src="images/backtop.png" width="20"/></a>
It is based on Node.js `EventEmitter`, and it provides a ready to use out-of-the-box implementation.
The framework is also leveraging this service internally to dispatch native events that can also be hooked by developers for design purposes.

| Native event | Description             |
|--------------|-------------------------|
| `http.in`    | Incoming HTTP request   |
| `http.out`   | Response towards client |
| `logger`     | Logging events          |
| `scheduler`  | Logging events          |

The Event Management System, besides the injectable `EventManagementService`, is also providing a set of decorators:
- `@OnEvent(event: string | NativeEventType)`

```typescript
@Injectable()
export class InternalService {
  constructor(private readonly eventManager: EventManagerService) { }

  @OnEvent('customEvent')
  consumeEvent(data: EventData) {
    console.log(data);
  }
}
```

### <a name="builtin-logger"></a>Logger service <a href="#toc"><img src="images/backtop.png" width="20"/></a>
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

### <a name="builtin-scheduler"></a>Scheduler service <a href="#toc"><img src="images/backtop.png" width="20"/></a>
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
