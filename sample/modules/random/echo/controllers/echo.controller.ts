import { Controller, Get, Param } from '../../../../../dist';

@Controller('/random/echo')
export class EchoController {
  @Get('/:echo')
  echo(@Param('echo') echo) {
    return { echo };
  }
}
