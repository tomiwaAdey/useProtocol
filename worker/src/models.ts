import { ColumnType, Generated } from 'kysely';
import z from 'zod';

export const ZodName = z.object({
	name: z.string().regex(/^[a-z0-9-.]+$/),
	owner: z.string(),
	addresses: z.record(z.string()).optional(),
	texts: z.record(z.string()).optional(),
	contenthash: z.string().optional(),
});

export const ZodNameWithSignature = ZodName.extend({
	signature: z.object({
		hash: z.string(),
		message: z.string(),
	}),
});

export type Name = z.infer<typeof ZodName>;
export type NameWithSignature = z.infer<typeof ZodNameWithSignature>;

export interface NameInKysely {
	name: string;
	owner: string;
	addresses: string | null;
	texts: string | null;
	contenthash: string | null;
	createdAt: ColumnType<Date, never, never>;
	updatedAt: ColumnType<Date, never, string | undefined>;
}
