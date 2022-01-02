import { HttpService, Injectable, OnProviderInit } from '../../../dist';

@Injectable()
export class ExternalTestService implements OnProviderInit {
  constructor(private readonly httpService: HttpService) {}

  onProviderInit() {
    console.log('I have been initialized', ExternalTestService.name);
  }

  async getExternalCall() {
    const httpTest = await this.httpService.request({
      params: {
        param1: 'externaTest',
        param2: 12345,
      },
      url: 'https://httpbin.org/get',
    });
    return { test: 'hello world', result: httpTest.data };
  }
}
