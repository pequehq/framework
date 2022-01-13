import { SwaggerComponent, SwaggerDtoProperty } from '../../../dist';

@SwaggerComponent()
export class ExternalDto {
  @SwaggerDtoProperty({ type: 'object' })
  external: any;
}
