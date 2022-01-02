import {
  HttpService,
  LoggerService,
  Module,
  OnModuleDestroy,
  OnModuleInit,
  OnServerShutdown,
  SocketIoServiceAdapter,
} from '../../../dist';
import { TestRouteInterceptor } from '../interceptor/test-route.interceptor';
import { RandomModule } from '../random/random.module';
import { TestController } from './controllers/test.controller';
import { ExternalTestService } from './external-test.service';
import { TestRootService } from './test-root.service';
import { TestWebsocket } from './ws/test-ws.websocket';

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
