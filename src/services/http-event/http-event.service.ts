import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '../../decorators';
import { HttpEvent } from '../../models';

export const httpEventQueue = new BehaviorSubject<HttpEvent | undefined>(undefined);

@Injectable()
export class HttpEventService {
  pushEvent(event: HttpEvent): void {
    httpEventQueue.next(event);
  }

  observable(): Observable<HttpEvent | undefined> {
    return httpEventQueue.asObservable();
  }
}
