import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '../../decorators/_index';
import { HttpEvent } from '../../models/_index';

export const httpEventQueue = new BehaviorSubject(null);

@Injectable()
export class HttpEventService {
  pushEvent(event: HttpEvent): void {
    httpEventQueue.next(event);
  }

  observable(): Observable<any> {
    return httpEventQueue.asObservable();
  }
}
