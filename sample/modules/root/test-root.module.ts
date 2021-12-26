import { HttpService, LoggerService, Module, SocketIoServiceAdapter } from '../../../src';
import { OnModuleDestroy, OnModuleInit, OnServerShutdown } from '../../../src/models/interfaces/life-cycle.interface';
import { RandomModule } from '../random/random.module';
import { TestController } from './controllers/test.controller';
import { ExternalTestService } from './external-test.service';
import { TestRootService } from './test-root.service';
import { TestWebsocket } from './ws/test-ws.websocket';
import { TestRouteInterceptor } from '../interceptor/test-route.interceptor';

@Module({
  modules: [RandomModule],
  controllers: [TestController],
  providers: [HttpService, ExternalTestService, TestRootService, LoggerService, SocketIoServiceAdapter],
  interceptors: [TestRouteInterceptor, TestRouteInterceptor],
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
