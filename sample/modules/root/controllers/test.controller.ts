import { Controller, Cookie, Get, Session, SwaggerResponse, SwaggerTag } from '../../../../src/decorators/_index';
import { Guard } from '../../../../src/decorators/authorization';
import { OnControllerInit } from '../../../../src/models/interfaces/life-cycle.interface';
import { HttpService } from '../../../../src/services/_index';
import { LoggerService } from '../../../../src/services/logger/logger.service';
import { ExternalDto } from '../../../models/dto/external.dto';
import { HelloWorldDto } from '../../../models/dto/hello-world.dto';
import { TestGuard } from '../../guards/test.guard';
import { ExternalTestService } from '../external-test.service';

@SwaggerTag(['Test'])
@Guard(TestGuard)
@Controller('/test')
export class TestController implements OnControllerInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly externalService: ExternalTestService,
    private readonly loggerService: LoggerService,
  ) {}

  onControllerInit() {
    console.log('I have been initialized', TestController.name);
  }

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
  @Guard(TestGuard)
  @Get('/hello-world')
  async helloWorld(@Cookie('hayu-portability') portability: string, @Session() session: any) {
    this.loggerService.log({ level: 'info', data: 'Test log from /hello-world' });
    return { test: 'hello world', portability, session };
  }

  @SwaggerResponse(
    {
      summary: 'External call',
      operationId: 'external',
      parameters: [],
    },
    [
      {
        statusCode: 200,
        object: ExternalDto,
        content: 'application/json; charset=utf-8',
        description: 'External call returned',
      },
    ],
  )
  @Get('/external')
  async external() {
    return { external: await this.externalService.getExternalCall() };
  }
}
