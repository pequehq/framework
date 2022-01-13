import { Module } from '../../../../dist';
import { EchoController } from './controllers/echo.controller';

@Module({
  controllers: [EchoController],
})
export class EchoModule {}
