import { SwaggerComponent, SwaggerDtoProperty } from '../../../src/decorators/swagger';

@SwaggerComponent()
export class ExternalDto {
  @SwaggerDtoProperty({ type: 'object' })
  external: any;
}
