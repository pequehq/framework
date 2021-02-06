import { Injectable } from '../../../src/decorators';
import { HttpEventService } from '../../../src/services';
import { HttpEvent } from '../../../src/models';

@Injectable()
export class TestRootService {
  constructor(private readonly httpEvents: HttpEventService) {
    this.httpEvents.observable().subscribe((data: HttpEvent) => {
      if (data) {
        console.log('received', data.req.path);
      }
    });
  }
}
