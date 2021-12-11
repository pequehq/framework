import { Cacheable, Controller, Get, Query, Request, Response } from '../../../../src/decorators/_index';
import { OnControllerDestroy, OnControllerInit } from '../../../../src/models/interfaces/life-cycle.interface';

@Controller('/random')
export class RandomController implements OnControllerInit, OnControllerDestroy {

  onControllerInit() {
    console.log('I have been initialized', RandomController.name);
  }

  onControllerDestroy() {
    console.log('I have been destroyed', RandomController.name);
  }

  @Cacheable({
    key: (...args) => args[2],
    server: 'server'
  })
  @Get('/number')
  getRandomNumber(
    @Request() req,
    @Response() res,
    @Query('ciaone') ciaone
  ) {
    return { random: Math.random() };
  }
}
