import cron, { ScheduledTask } from 'node-cron'
import { Injectable } from '../../decorators/injectable';
import { DECORATORS } from '../../models/constants/decorators';
import { SchedulerConfig } from '../../decorators/scheduler';

@Injectable()
export class SchedulerService {
  private tasks: Map<string, ScheduledTask> = new Map<string, ScheduledTask>();

  constructor() {
    const scheduleMap: Map<string, SchedulerConfig> = Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) || new Map<string, SchedulerConfig>();
    scheduleMap.forEach((value, key) => {
      this.tasks.set(value.name, cron.schedule(value.cron, value.listener));
    });
  }

  getScheduler(name: string): ScheduledTask {
    return this.tasks.get(name);
  }

  getAllScheduler(): Map<string, ScheduledTask> {
    return this.tasks;
  }
}
