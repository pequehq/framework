import { DECORATORS } from '../models/constants/decorators';
import { SchedulerService } from '../services/scheduler/scheduler.service';

export interface SchedulerConfig {
  cron: string;
  name: string;
  listener: any
}

export const Scheduler = (name: string, cron: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const scheduleMap: Map<string, SchedulerConfig> = Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) || new Map<string, SchedulerConfig>();
    scheduleMap.set(`${target.constructor.name}_${propertyKey}`, { name, cron, listener: descriptor.value});
    Reflect.defineMetadata(DECORATORS.metadata.SCHEDULER, scheduleMap, SchedulerService);
    return descriptor;
  };
}
