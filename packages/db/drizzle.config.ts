import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: "../../.env",
});

export default defineConfig({
	schema: "./schema.ts",
	dialect: "postgresql",
	out: "./drizzle",
	dbCredentials: {
		url: `${process.env.POSTGRES_URL as string}?sslmode=require`,
	},
	breakpoints: true,
});
