import { Module } from '../../../src/decorators';
import { OnModuleDestroy, OnModuleInit, OnServerShutdown } from '../../../src/models/interfaces/life-cycle.interface';
import { HttpService } from '../../../src/services';
import { LoggerService } from '../../../src/services/logger/logger.service';
import { RandomModule } from '../random/random.module';
import { TestController } from './controllers/test.controller';
import { ExternalTestService } from './external-test.service';
import { TestRootService } from './test-root.service';

@Module({
  modules: [RandomModule],
  controllers: [TestController],
  providers: [HttpService, ExternalTestService, TestRootService, LoggerService],
})
export class TestRootModule implements OnModuleInit, OnModuleDestroy, OnServerShutdown {
  async onModuleInit() {
    console.log('I have been initialized', TestRootModule.name);
  }

  async onModuleDestroy() {
    console.log('I have been destroyed', TestRootModule.name);
  }

  async onServerShutdown() {
    console.log('Server has shutdown', TestRootModule.name);
  }
}
