---
title: Controllers
has_children: false
nav_order: 5
---

# Controllers
The controllers are the components designated to handle the incoming **requests** and to return **responses** to the client.

![Controllers](images/controllers.png)

## Routings
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

| Decorator                                               | Description                          |
|---------------------------------------------------------|--------------------------------------|
| `@Request()`                                            | The entire `express.Request` object  |
| `@Response()`                                           | The entire `express.Response` object |
| `@Param(key: string, transformer?: TransformerClass)`   | `req.params` or `req.params[key]`    | 
| `@Query(key: string, transformer?: TransformerClass)`   | `req.params` or `req.query[key]`     |
| `@Header(key: string, transformer?: TransformerClass)`  | `req.headers` or `req.headers[key]`  |
| `@Body(, transformer?: TransformerClass)`               | `req.body`                           |
| `@Session()`                                            | `req.session`                        |
| `@Cookie(name: string)`                                 | `req.cookies`                        |
