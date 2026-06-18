import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const collections = await this.databaseConnection.listCollections();

    const dropPromises = collections
      .filter((col) => !col.name.startsWith('system.')) // Ігноруємо системні колекції
      .map((col) => this.databaseConnection.dropCollection(col.name));

    await Promise.all(dropPromises);

    return {
      status: 'succeeded',
    };
  }
}
