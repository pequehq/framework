import { SwaggerComponent, SwaggerDtoProperty } from '../../../dist';

@SwaggerComponent()
export class HelloWorldDto {
  @SwaggerDtoProperty({ type: 'string' })
  test: string;
}
