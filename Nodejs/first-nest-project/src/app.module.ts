import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './Products/products.module';
import { DbConnectionModule } from './mongodb/db-connection.module';
@Module({
  imports: [ProductsModule, DbConnectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
