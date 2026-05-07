import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@Controller()
@ApiTags('App')
export class AppController {
  @Public()
  @Get()
  @Redirect('/api', 302)
  getRoot() {}

  @Public()
  @Get('/hello-world')
  getHelloWorld() {
    return {
      title: 'HelloWorld!',
    };
  }
}
