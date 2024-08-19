import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "itlxdtyrc4ggxyuw.public.blob.vercel-storage.com",
			},
		],
	},
	async headers(){
		return [
			{
				source:"/events",
				headers:[
					{
						key:"x-timezone",
						value:Intl.DateTimeFormat().resolvedOptions().timeZone
					}
				]
			}
		]
	}
};

export default nextConfig;
