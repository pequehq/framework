import { DECORATORS } from '../models/constants/decorators';
import { SchedulerService } from '../services/scheduler/scheduler.service';

export interface SchedulerConfig<T = unknown> {
  cron: string;
  name: string;
  listener: T;
}

export const Scheduler = (name: string, cron: string): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    const scheduleMap: Map<string, SchedulerConfig<T>> = Reflect.getMetadata(
      DECORATORS.metadata.SCHEDULER,
      SchedulerService,
    ) ?? new Map<string, SchedulerConfig<T>>();

    scheduleMap.set(`${target.constructor.name}_${propertyKey}`, { name, cron, listener: descriptor.value });
    Reflect.defineMetadata(DECORATORS.metadata.SCHEDULER, scheduleMap, SchedulerService);
    return descriptor;
  };
};
