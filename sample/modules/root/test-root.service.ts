import { Injectable } from '../../../src/decorators/_index';
import { HttpEventService } from '../../../src/services/_index';
import { HttpEvent } from '../../../src/models/_index';

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
