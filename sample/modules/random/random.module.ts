import { Module } from '../../../src/decorators';
import { OnModuleInit } from '../../../src/models/interfaces/life-cycle.interface';
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
