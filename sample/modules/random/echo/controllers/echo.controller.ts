import { Controller, Get, Param } from '../../../../../src/decorators';

@Controller('/random/echo')
export class EchoController {
  @Get('/:echo')
  echo(@Param('echo') echo) {
    return { echo };
  }
}
