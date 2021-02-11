import { Injectable } from '../../decorators/_index';
import { BehaviorSubject } from 'rxjs';
import { HttpEvent } from '../../models/_index';

export const httpEventQueue = new BehaviorSubject(null);

@Injectable()
export class HttpEventService {
  pushEvent(event: HttpEvent) {
    httpEventQueue.next(event);
  }

  observable() {
    return httpEventQueue.asObservable();
  }
}
