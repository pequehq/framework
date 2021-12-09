import { Injectable } from '../../../src/decorators/_index';
import { HttpService } from '../../../src/services/_index';
import { OnProviderInit } from '../../../src/models/interfaces/life-cycle.interface';

@Injectable()
export class ExternalTestService implements OnProviderInit {
  constructor(private readonly httpService: HttpService) {
  }

  onProviderInit() {
    console.log('I have been initialized', ExternalTestService.name);
  }

  async getExternalCall() {
    const httpTest = await this.httpService.get({
      query: {
        param1: 'externaTest',
        param2: 12345
      },
      url: 'https://httpbin.org/get',
    });
    return { test: 'hello world', result: httpTest };
  }

  getTest() {
    return 'waffle';
  }
}
