import { Injectable } from '../../decorators';
import { LogLevelsType, ServerOptions } from '../../models';
import { CONFIG_STORAGES } from '../../models/constants/config';
import { ConfigService } from '../config/config.service';
import { EventManagerService, EventPayload } from '../events/event-manager.service';

interface LogEvent<TData> {
  level: LogLevelsType;
  data: TData;
}

const LOG_LEVELS_MAPPING = {
  debug: { level: 'debug', order: 1 },
  error: { level: 'error', order: 2 },
  warn: { level: 'warn', order: 3 },
  info: { level: 'info', order: 4 },
};

const calculateLogLevel = (level: LogLevelsType): number => LOG_LEVELS_MAPPING[level].order;

@Injectable()
export class LoggerService {
  constructor(public readonly eventManager: EventManagerService, public readonly configService: ConfigService) {
    this.subscribe((value) => {
      const serverOptions = this.configService.get<ServerOptions>(CONFIG_STORAGES.EXPRESS_SERVER);
      if (
        serverOptions.logger &&
        calculateLogLevel(value.data.level) >= calculateLogLevel(serverOptions.logger.level)
      ) {
        if (serverOptions.logger.consoleOutput) {
          console[value.data.level](`[${value.timestamp}]`, `[${value.data.level}]`, value.data.data);
        }
      }
    });
  }

  log<TData>(event: LogEvent<TData>): void {
    this.eventManager.push('logger', event);
  }

  subscribe(listener: (payload: EventPayload<LogEvent<never>>) => void): void {
    this.eventManager.subscribe('logger', listener);
  }
}
