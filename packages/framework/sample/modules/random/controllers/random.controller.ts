import {
  Cacheable,
  Controller,
  Get,
  OnControllerDestroy,
  OnControllerInit,
  Query,
  Request,
  Response,
} from '../../../../dist';

@Controller('/random')
export class RandomController implements OnControllerInit, OnControllerDestroy {
  onControllerInit() {
    console.log('I have been initialized', RandomController.name);
  }

  onControllerDestroy() {
    console.log('I have been destroyed', RandomController.name);
  }

  @Cacheable({
    key: 'testKey',
  })
  @Get('/number')
  getRandomNumber(@Request() req, @Response() res, @Query('ciaone') ciaone) {
    return { random: Math.random() };
  }
}
