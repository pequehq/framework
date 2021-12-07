import { Module } from '../../../src/decorators/_index';
import { TestController } from './controllers/test.controller';
import { RandomModule } from '../random/random.module';
import { HttpService } from '../../../src/services/_index';
import { ExternalTestService } from './external-test.service';
import { TestRootService } from './test-root.service';
import { LoggerService } from '../../../src/services/logger/logger.service';

@Module({
  modules: [RandomModule],
  controllers: [TestController],
  providers: [
    HttpService,
    ExternalTestService,
    TestRootService,
    LoggerService
  ]
})
export class TestRootModule {

}
