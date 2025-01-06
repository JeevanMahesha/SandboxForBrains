import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('YOUR CONNECTION STRING')],
  controllers: [],
  providers: [],
})
export class DbConnectionModule {}
