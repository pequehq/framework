import { Controller, Get, SwaggerResponse, SwaggerTag } from '../../../../src/decorators/_index';
import { HttpService } from '../../../../src/services/_index';
import { ExternalTestService } from '../external-test.service';
import { HelloWorldDto } from '../../../models/dto/hello-world.dto';
import { ExternalDto } from '../../../models/dto/external.dto';
import { LoggerService } from '../../../../src/services/logger/logger.service';

@SwaggerTag(['Test'])
@Controller('/test')
export class TestController {
  constructor(private readonly httpService: HttpService,
              private readonly externalService: ExternalTestService,
              private readonly loggerService: LoggerService) {
  }

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
  async helloWorld() {
    this.loggerService.log({level: 'info', data: 'Test log from /hello-world'});
    return { test: 'hello world' };
  }

  @SwaggerResponse({
    summary: 'External call',
    operationId: 'external',
    parameters: []
  }, [
    {
      statusCode: 200,
      object: ExternalDto,
      content: 'application/json; charset=utf-8',
      description: 'External call returned'
    }
  ])
  @Get('/external')
  async external() {
    return { external: await this.externalService.getExternalCall() };
  }
}
