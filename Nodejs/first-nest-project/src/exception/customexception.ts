import { HttpException } from '@nestjs/common';

export class Customexception extends HttpException {
  constructor(errorMessage: string, statusCode: number) {
    super(errorMessage, statusCode);
  }
}
