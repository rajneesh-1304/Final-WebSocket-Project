import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import {Session} from './auth/session.entity';

const rawDataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'cookie',
  synchronize: false,
  entities: [
    User, Session
  ],
  seeds: ['dist/src/seeds/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  logging: true
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;