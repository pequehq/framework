import { SwaggerComponent, SwaggerDtoProperty } from '../../../src/decorators/swagger';

@SwaggerComponent()
export class HelloWorldDto {
  @SwaggerDtoProperty({ type: 'string' })
  test: string;
}
