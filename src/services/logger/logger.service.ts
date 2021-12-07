import { Injectable } from '../../decorators/injectable';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogLevelsType } from '../../models/interfaces/types';
import { ExpressFactory } from '../../factory/express-factory';

interface LogEvent {
  level: LogLevelsType;
  data: any;
}

interface LogEventData extends LogEvent {
  timestamp: number;
}

@Injectable()
export class LoggerService {
  private loggerQueue = new BehaviorSubject<LogEventData>(undefined);

  constructor() {
    this.observable().subscribe(value => {
      if (value) {
        const serverOptions = ExpressFactory.getServerOptions();
        if (serverOptions.logger && (value.level === serverOptions.logger.level)) {
          if (serverOptions.logger.consoleOutput) {
            console[value.level](`[${value.timestamp}]`, `[${value.level}]`, value.data);
          }
        }
      }
    });
  }

  log(event: LogEvent) {
    this.loggerQueue.next({ ...event, timestamp: Date.now()});
  }

  observable(): Observable<LogEventData> {
    return this.loggerQueue.asObservable();
  }
}
