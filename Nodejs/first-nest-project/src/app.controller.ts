import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('json')
  @Header('X-Token', 'Barear Token')
  getJsonObject(): { name: string } {
    return { name: 'Jeevan' };
  }
}
