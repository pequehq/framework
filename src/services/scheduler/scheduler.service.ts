import 'reflect-metadata';

import cron, { ScheduledTask } from 'node-cron';

import { SchedulerConfig } from '../../decorators';
import { DECORATORS } from '../../models/constants/decorators';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';

export class SchedulerService {
  #tasks: Map<string, ScheduledTask> = new Map<string, ScheduledTask>();

  constructor() {
    const scheduleMap: Map<string, SchedulerConfig> =
      Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) ?? new Map<string, SchedulerConfig>();

    for (const value of scheduleMap.values()) {
      this.#tasks.set(value.name, cron.schedule(value.cron, value.listener));
    }
  }

  getScheduler(name: string): ScheduledTask | undefined {
    return this.#tasks.get(name);
  }

  getAllScheduler(): Map<string, ScheduledTask> {
    return this.#tasks;
  }
}

// @TODO remove to eliminate side-effects on module import
Injector.setNative('injectable', NATIVE_SERVICES.SCHEDULER, SchedulerService);
