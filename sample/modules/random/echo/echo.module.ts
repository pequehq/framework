import { Module } from '../../../../src/decorators/module';
import { EchoController } from './controllers/echo.controller';

@Module({
  controllers: [EchoController],
})
export class EchoModule {}
