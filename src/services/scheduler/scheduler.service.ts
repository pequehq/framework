import cron, { ScheduledTask } from 'node-cron';

import { Injectable } from '../../decorators/injectable';
import { SchedulerConfig } from '../../decorators/scheduler';
import { DECORATORS } from '../../models/constants/decorators';

@Injectable()
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
