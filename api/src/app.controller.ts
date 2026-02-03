import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  @Get()
  @Redirect('/api', 302)
  getHello() {
    // This will redirect to /api
  }
}
