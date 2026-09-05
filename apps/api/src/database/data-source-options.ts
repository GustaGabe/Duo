import { DataSourceOptions } from 'typeorm';

import { InitialSchema1757030000000 } from './migrations/1757030000000-initial-schema';
import { SpacesAndCategories1757120000000 } from './migrations/1757120000000-spaces-and-categories';

export function buildDataSourceOptions(url: string): DataSourceOptions {
  return {
    type: 'postgres',
    url,
    entities: [`${__dirname}/../modules/**/*.orm-entity{.ts,.js}`],
    migrations: [InitialSchema1757030000000, SpacesAndCategories1757120000000],
    synchronize: false,
    migrationsRun: true,
    logging:
      process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : ['error'],
  };
}
