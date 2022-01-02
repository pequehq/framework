import { OnProviderDestroy } from '../../../dist';
import { HttpEventService } from '../../../dist';
import { HttpEvent } from '../../../dist';
import { OnServerShutdown } from '../../../dist';
import { OnProviderInit } from '../../../dist';
import { Injectable } from '../../../dist';

@Injectable()
export class TestRootService implements OnProviderInit, OnProviderDestroy, OnServerShutdown {
  onProviderInit() {
    console.log('I have been initialized', TestRootService.name);
  }

  onProviderDestroy() {
    console.log('I have been destroyed', TestRootService.name);
  }

  async onServerShutdown() {
    console.log('Server has shutdown', TestRootService.name);
  }

  constructor(private readonly httpEvents: HttpEventService) {
    this.httpEvents.observable().subscribe((data: HttpEvent | undefined) => {
      if (data) {
        console.log('received', data.req.path);
      }
    });
  }
}
