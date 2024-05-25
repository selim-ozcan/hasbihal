import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, database, up } from 'migrate-mongo';

/* Used a migration lib to apply index on a collection column. 
   But this is actually unnecessary since it's possible to set unique index at the schema level using mongoose.
   Nonetheless migrate-mongo could be useful to apply updates on existing data. */

@Injectable()
export class DbMigrationService implements OnModuleInit {
  private readonly dbMigrationConfig: Partial<config.Config> = {
    mongodb: {
      databaseName: this.configService.getOrThrow('DB_NAME'),
      url: this.configService.getOrThrow('MONGODB_URI'),
    },
    migrationsDir: `${__dirname}/migrations`,
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
  };

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    config.set(this.dbMigrationConfig);
    const { db, client } = await database.connect();
    await up(db, client);
  }
}
