import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		loader: "custom",
		loaderFile: "./imageLoader.ts",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
			{
				protocol: "https",
				hostname: "images.clerk.dev",
			},
			// Reccomended: add whatever bucket that you use for storing thumbnails and resumes to this list
			{
				protocol: "https",
				hostname:
					"cdc7630e53b468f56a4453af71a58ade.r2.cloudflarestorage.com",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/events",
				headers: [
					{
						key: "x-timezone",
						value: Intl.DateTimeFormat().resolvedOptions().timeZone,
					},
				],
			},
		];
	},
};
if (process.env.NODE_ENV === "development") {
	await setupDevPlatform();
}
export default nextConfig;
