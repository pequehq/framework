import { Module } from '../../../src/decorators';
import { RandomController } from './controllers/random.controller';
import { EchoModule } from './echo/echo.module';

@Module({
  modules: [EchoModule],
  controllers: [RandomController],
})
export class RandomModule {

}
