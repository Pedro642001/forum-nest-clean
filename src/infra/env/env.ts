import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_PRIVATE_KEY: z.string().base64(),
	JWT_PUBLIC_KEY: z.string().base64(),
	PORT: z.coerce.number().optional().default(3333),
	HASH_SALT_LENGTH: z.coerce.number().optional().default(8),
});

export type Env = z.infer<typeof envSchema>;
