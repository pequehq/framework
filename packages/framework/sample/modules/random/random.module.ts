import { Module, OnModuleInit } from '../../../dist';
import { RandomController } from './controllers/random.controller';
import { EchoModule } from './echo/echo.module';

@Module({
  modules: [EchoModule],
  controllers: [RandomController],
})
export class RandomModule implements OnModuleInit {
  async onModuleInit() {
    console.log('I have been initialized', RandomModule.name);
  }
}
