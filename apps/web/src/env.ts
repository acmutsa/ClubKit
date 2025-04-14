import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { emailsConfig } from "config";

export const env = createEnv({
	server: {
		CLERK_SECRET_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_BASE_URL: emailsConfig.useEmailService
			? z.string()
			: z.string().optional(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	},
	emptyStringAsUndefined: true,
});
