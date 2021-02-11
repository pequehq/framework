import { Controller, Get } from '../../../../src/decorators/_index';
import { HttpService } from '../../../../src/services/_index';
import { ExternalTestService } from '../external-test.service';

@Controller('/test')
export class TestController {
  constructor(private readonly httpService: HttpService,
              private readonly externalService: ExternalTestService) {
  }

  @Get('/hello-world')
  async helloWorld() {
    const httpTest = await this.httpService.get({
      query: {
        param1: 'test',
        param2: 12345
      },
      url: 'https://httpbin.org/get',
    });
    return { test: 'hello world', result: httpTest };
  }

  @Get('/external')
  async external() {
    return { test: 'hello world', result: await this.externalService.getExternalCall()};
  }
}
