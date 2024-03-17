import { Env } from '../env';
import { NameInKysely } from '../models';
import { CamelCasePlugin, Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

export interface Database {
	names: NameInKysely;
}

export function createKysely(env: Env): Kysely<Database> {
	return new Kysely<Database>({
		dialect: new D1Dialect({ database: env.DB }),
		plugins: [new CamelCasePlugin()],
	});
}
