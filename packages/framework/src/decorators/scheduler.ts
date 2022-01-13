import 'reflect-metadata';

import { DECORATORS } from '../models/constants/decorators';
import { SchedulerService } from '../services';

export interface SchedulerConfig {
  cron: string;
  name: string;
  listener: (...args: unknown[]) => void;
}

export const Scheduler = (name: string, cron: string): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    const scheduleMap: Map<string, SchedulerConfig> =
      Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) ?? new Map<string, SchedulerConfig>();

    scheduleMap.set(`${target.constructor.name}_${propertyKey}`, { name, cron, listener: descriptor.value });
    Reflect.defineMetadata(DECORATORS.metadata.SCHEDULER, scheduleMap, SchedulerService);
    return descriptor;
  };
};
