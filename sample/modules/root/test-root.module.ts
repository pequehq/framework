import { Module } from '../../../src';
import { OnModuleDestroy, OnModuleInit, OnServerShutdown } from '../../../src/models/interfaces/life-cycle.interface';
import { HttpService } from '../../../src';
import { LoggerService } from '../../../src';
import { SocketIoServiceAdapter } from '../../../src';
import { RandomModule } from '../random/random.module';
import { TestController } from './controllers/test.controller';
import { ExternalTestService } from './external-test.service';
import { TestRootService } from './test-root.service';
import { TestWebsocket } from './ws/test-ws.websocket';
import { TestExceptionInterceptor } from '../interceptor/test-exception.interceptor';

@Module({
  modules: [RandomModule],
  controllers: [TestController],
  providers: [HttpService, ExternalTestService, TestRootService, LoggerService, SocketIoServiceAdapter],
  interceptors: [TestExceptionInterceptor],
  webSockets: [TestWebsocket],
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
