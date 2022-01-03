import {
  Controller,
  Cookie,
  ForbiddenError,
  Get,
  Guard,
  HttpService,
  Intercept,
  LoggerService,
  OnControllerInit,
  Query,
  Session,
  SwaggerResponse,
  SwaggerTag,
  UseMiddleware,
} from '../../../../dist';
import { ExternalDto } from '../../../models/dto/external.dto';
import { HelloWorldDto } from '../../../models/dto/hello-world.dto';
import { TestGuard } from '../../guards/test.guard';
import { TestControllerInterceptor } from '../../interceptor/test-controller.interceptor';
import { TestRouteInterceptor } from '../../interceptor/test-route.interceptor';
import { TestMwMiddleware } from '../../middlewares/test-mw.middleware';
import { TestTransformer } from '../../transformers/test-transformer';
import { ExternalTestService } from '../external-test.service';

@SwaggerTag(['Test'])
@Intercept(TestControllerInterceptor)
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
  @Intercept(TestRouteInterceptor)
  @UseMiddleware(TestMwMiddleware)
  @Get('/external')
  async external() {
    return { external: await this.externalService.getExternalCall() };
  }

  @Intercept(TestRouteInterceptor)
  @Get('/error')
  async error() {
    throw new ForbiddenError({ error: { test: 'payload' }, message: 'This is an error' });
  }

  @Get('/transformer')
  async transformer(@Query('testTransformer', TestTransformer) param: string) {
    return param;
  }
}
