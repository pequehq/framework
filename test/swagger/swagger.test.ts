import 'reflect-metadata';
import { SwaggerComponent, SwaggerDtoProperty, SwaggerResponseBody } from '../../src/decorators/swagger';
import { SwaggerComponents, SwaggerResponseBodies } from '../../src/decorators/utils/swagger';

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
});
