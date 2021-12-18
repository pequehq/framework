import 'reflect-metadata';

import { HelloWorldDto } from '../../sample/models/dto/hello-world.dto';
import { Controller } from '../../src/decorators/controller';
import { Get } from '../../src/decorators/express-methods';
import {
  SwaggerComponent,
  SwaggerDtoProperty,
  SwaggerParameter,
  SwaggerResponse,
  SwaggerResponseBody,
  SwaggerSecuritySchema,
  SwaggerTag,
} from '../../src/decorators/swagger';
import {
  SwaggerComponents,
  SwaggerParameters,
  SwaggerResponseBodies,
  SwaggerSecuritySchemas,
} from '../../src/decorators/utils/swagger';
import { DECORATORS } from '../../src/models/constants/decorators';
import { SwaggerRouteDefinition } from '../../src/models/interfaces/swagger/swagger-route-definition.interface';
import { loadInjectables } from '../../src/utils/dependencies.utils';

describe('Swagger decorators', () => {
  beforeAll(async () => await loadInjectables());

  @SwaggerComponent()
  class TestComponent {
    @SwaggerDtoProperty({ type: 'object' })
    objectProperty: any;

    @SwaggerDtoProperty({ type: 'string' })
    stringProperty: string;
  }

  @SwaggerResponseBody()
  class TestComponentResponseBody {
    @SwaggerDtoProperty({ type: 'object' })
    objectProperty: any;

    @SwaggerDtoProperty({ type: 'string' })
    stringProperty: string;
  }

  @SwaggerParameter()
  class TestParameter {}

  @SwaggerSecuritySchema()
  class TestSecurityScheme {}

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
          object: HelloWorldDto,
          content: 'application/json; charset=utf-8',
          description: 'Hello World returned',
        },
      ],
    )
    @Get('/hello-world')
    async helloWorld() {
      return { test: 'hello world' };
    }
  }

  describe('@SwaggerComponent decorator', () => {
    it('should contain all the decorated components', () => {
      expect(SwaggerComponents).toContain(TestComponent);
    });
  });

  describe('@SwaggerResponseBody decorator', () => {
    it('should contain all the decorated components', () => {
      expect(SwaggerResponseBodies).toContain(TestComponentResponseBody);
    });
  });

  describe('@SwaggerParameter decorator', () => {
    it('should contain all the decorated components', () => {
      expect(SwaggerParameters).toContain(TestParameter);
    });
  });

  describe('@SwaggerSecuritySchema decorator', () => {
    it('should contain all the decorated components', () => {
      expect(SwaggerSecuritySchemas).toContain(TestSecurityScheme);
    });
  });

  describe('@SwaggerDtoProperty decorator', () => {
    it('should contain all the decorated components', () => {
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
      const key = `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${TestComponent.name}`;
      const properties = Reflect.getMetadata(key, TestComponent) || [];
      expect(properties).toEqual(testProperties);
    });
  });

  describe('@SwaggerTag decorator', () => {
    it('should contain all the decorated components', () => {
      expect(Reflect.getMetadata(DECORATORS.metadata.swagger.TAGS, TestController)).toEqual(['Test']);
    });
  });

  describe('@SwaggerResponse decorator', () => {
    const testResponse: SwaggerRouteDefinition[] = [
      {
        options: {
          content: 'application/json; charset=utf-8',
          operationId: 'helloWorld',
          parameters: [],
          summary: 'Hello World',
        },
        responses: [
          {
            content: 'application/json; charset=utf-8',
            description: 'Hello World returned',
            object: 'HelloWorldDto',
            refPath: '../../../components/schemas/schemas-generated.yaml#/HelloWorldDto',
            statusCode: 200,
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
          noRestWrapper: false,
          path: '/hello-world',
          requestMethod: 'get',
        },
      },
    ];
    it('should contain all the decorated components', () => {
      expect(Reflect.getMetadata(DECORATORS.metadata.swagger.ROUTES, TestController)).toEqual(testResponse);
    });
  });
});
