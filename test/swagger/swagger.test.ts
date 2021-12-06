import 'reflect-metadata';
import { SwaggerComponent, SwaggerDtoProperty, SwaggerResponseBody } from '../../src/decorators/swagger';
import { SwaggerComponents, SwaggerResponseBodies } from '../../src/decorators/utils/swagger';
import { DECORATORS } from '../../src/models/constants/decorators';

describe('Swagger decorators', () => {

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
          object: undefined
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
          object: undefined
        }
      ]
      const key = `${DECORATORS.metadata.swagger.DTO_PROPERTY}_${TestComponent.name}`;
      const properties = Reflect.getMetadata(key, TestComponent) || [];
      expect(properties).toEqual(testProperties);
    });
  });
});
