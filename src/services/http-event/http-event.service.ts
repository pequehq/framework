import { Observable, Subject } from 'rxjs';

import { Injectable } from '../../decorators';
import { HttpEvent } from '../../models';

export const httpEventQueue = new Subject<HttpEvent>();

@Injectable()
export class HttpEventService {
  pushEvent(event: HttpEvent): void {
    httpEventQueue.next(event);
  }

  observable(): Observable<HttpEvent | undefined> {
    return httpEventQueue.asObservable();
  }
}
