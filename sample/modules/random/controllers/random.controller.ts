import { Cacheable, Controller, Get, Query, Request, Response } from '../../../../src/decorators';

@Controller('/random')
export class RandomController {
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
