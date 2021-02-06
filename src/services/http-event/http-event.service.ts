import { Injectable } from '../../decorators';
import { BehaviorSubject } from 'rxjs';
import { HttpEvent } from '../../models';

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
