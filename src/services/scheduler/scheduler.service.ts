import 'reflect-metadata';

import cron, { ScheduledTask } from 'node-cron';

import { SchedulerConfig } from '../../decorators';
import { DECORATORS } from '../../models/constants/decorators';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/injector.service';

export class SchedulerService {
  private tasks: Map<string, ScheduledTask> = new Map<string, ScheduledTask>();

  constructor() {
    const scheduleMap: Map<string, SchedulerConfig> =
      Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) ?? new Map<string, SchedulerConfig>();

    scheduleMap.forEach((value) => {
      this.tasks.set(value.name, cron.schedule(value.cron, value.listener));
    });
  }

  getScheduler(name: string): ScheduledTask | undefined {
    return this.tasks.get(name);
  }

  getAllScheduler(): Map<string, ScheduledTask> {
    return this.tasks;
  }
}

Injector.setNative('injectable', NATIVE_SERVICES.SCHEDULER, SchedulerService);
