import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { SwaggerRouteDefinition } from '../models/interfaces/swagger/swagger-route-definition.interface';
import { Controller } from './controller';
import { Get } from './express-methods';
import {
  SwaggerComponent,
  SwaggerDtoProperty,
  SwaggerParameter,
  SwaggerResponse,
  SwaggerResponseBody,
  SwaggerSecuritySchema,
  SwaggerTag,
} from './swagger';
import { SwaggerComponents, SwaggerParameters, SwaggerResponseBodies, SwaggerSecuritySchemas } from './utils/swagger';

const test = suite('Swagger');

test.before(async (context) => {
  @SwaggerComponent()
  class TestComponent {
    @SwaggerDtoProperty({ type: 'object' })
    objectProperty: unknown;

    @SwaggerDtoProperty({ type: 'string' })
    stringProperty: string;
  }

  @SwaggerResponseBody()
  class TestComponentResponseBody {
    @SwaggerDtoProperty({ type: 'object' })
    objectProperty: unknown;

    @SwaggerDtoProperty({ type: 'string' })
    stringProperty: string;
  }

  @SwaggerParameter()
  class TestParameter {}

  @SwaggerSecuritySchema()
  class TestSecuritySchema {}

  @SwaggerTag(['Test'])
  @Controller()
  class TestController {
    @SwaggerResponse(
      {
        summary: 'Hello World',
        operationId: 'helloWorld',
        parameters: [],
      },
      [
        {
          statusCode: 200,
          object: TestComponent,
          content: 'application/json; charset=utf-8',
          description: 'Hello World returned',
        },
      ],
    )
    @Get('/hello-world')
    async helloWorld(): Promise<unknown> {
      return { test: 'hello world' };
    }
  }

  context.classes = {
    component: TestComponent,
    requestBody: TestComponentResponseBody,
    parameter: TestParameter,
    securitySchema: TestSecuritySchema,
    controller: TestController,
  };
});

test('@SwaggerComponent() should set swagger components', async (context) => {
  assert.ok(SwaggerComponents.includes(context.classes.component));
  assert.ok(SwaggerResponseBodies.includes(context.classes.requestBody));
});

test('@SwaggerDtoProperty should set swagger dto properties metadata', async (context) => {
  const testProperties = [
    {
      name: 'objectProperty',
      type: 'object',
      isEnum: false,
      arrayType: undefined,
      isArrayObject: false,
      enum: undefined,
      example: undefined,
      description: undefined,
      multipleRefs: false,
      ref: undefined,
      isRef: false,
      isArray: false,
      required: undefined,
      object: undefined,
    },
    {
      name: 'stringProperty',
      type: 'string',
      isEnum: false,
      arrayType: undefined,
      isArrayObject: false,
      enum: undefined,
      example: undefined,
      description: undefined,
      multipleRefs: false,
      ref: undefined,
      isRef: false,
      isArray: false,
      required: undefined,
      object: undefined,
    },
  ];
  const key = `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${context.classes.component.name}`;
  assert.equal(Reflect.getMetadata(key, context.classes.component), testProperties);
});

test('@SwaggerTag() should set swagger tag metadata', async (context) => {
  assert.equal(Reflect.getMetadata(DECORATORS.metadata.swagger.TAGS, context.classes.controller), ['Test']);
});

test('@SwaggerResponse should set swagger response metadata', async (context) => {
  const testResponse: SwaggerRouteDefinition[] = [
    {
      options: {
        content: 'application/json; charset=utf-8',
        operationId: 'helloWorld',
        parameters: [],
        requestBody: undefined,
        summary: 'Hello World',
      },
      responses: [
        {
          content: 'application/json; charset=utf-8',
          description: 'Hello World returned',
          object: 'TestComponent',
          refPath: '../../../components/schemas/schemas-generated.yaml#/TestComponent',
          statusCode: 200,
          example: undefined,
        },
      ],
      route: {
        documentOnly: false,
        method: {
          body: [],
          cookies: [],
          headers: [],
          name: 'helloWorld',
          params: [],
          query: [],
          request: [],
          response: [],
          session: [],
        },
        middlewareFunctions: [],
        path: '/hello-world',
        requestMethod: 'get',
        interceptors: [],
        guards: [],
      },
    },
  ];
  assert.equal(Reflect.getMetadata(DECORATORS.metadata.swagger.ROUTES, context.classes.controller), testResponse);
});

test('@SwaggerParameter() should set swagger parameter', async (context) => {
  assert.ok(SwaggerParameters.includes(context.classes.parameter));
});

test('@SwaggerSecuritySchema() should set swagger security schema', async (context) => {
  assert.ok(SwaggerSecuritySchemas.includes(context.classes.securitySchema));
});

test.run();
