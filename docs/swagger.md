---
title: Swagger
has_children: false
nav_order: 10
---

# Swagger (OpenAPI)
The key concept is to avoid or to maintain the Swagger (**OpenAPI**) document manually as less as possible.
For this purpose, the framework provides a set of decorators that enables the definition of the metadata for the automatic generation of the OpenAPI document.

![](images/tommy-shelby-mad.gif)

## Tag
The tags object allows the paths (endpoints) to be **arranged** into named groups in the Swagger document.
The decorator `@SwaggerTag()` provides the definition of the metadata for a `@Controller()` to do so.
```typescript
@SwaggerTag(['Test'])
@Controller('/test')
export class TestController {
  
}
```

## Response
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

## Component
The component object contains all the **properties** about a response **DTO**.
The decorator `@SwaggerComponents()` provides the definition of the metadata for a DTO class.
```typescript
@SwaggerComponent()
export class HelloWorldDto {
  @SwaggerDtoProperty({ type: 'string' })
  test: string;
}
```

## Request body
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

## Parameter
The parameter object contains all the **properties** needed to express a parameter, and it must implement the interface `SwaggerSecSchemaDefinition`
The decorator **@SwaggerParameter()** provides the definition of the metadata for a parameter class.
```typescript
@SwaggerParameter()
export class EchoParameterDto implements SwaggerSecSchemaDefinition {
  @SwaggerDtoProperty({ type: 'string' })
  echo: string;
}
```

## Security schema
The security schema object contains all the **properties** needed to express a security schema, and it must implement the interface `SwaggerSecSchemaDefinition`
The decorator `@SwaggerSecSchema()` provides the definition of the metadata for a parameter class.
```typescript
@SwaggerSecuritySchema()
export class BearerAuthSecSchema implements SwaggerSecSchemaDefinition {

}
```

## Property
The decorator `@SwaggerDtoProperty()` provides the definition of the metadata for **properties** that belongs only to classes decorated with:
- `@SwaggerComponent()`
- `@SwaggerRequestBody()`
- `@SwaggerParameter()`
- `@SwaggerSecuritySchema()`
