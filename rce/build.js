import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import { build } from "esbuild";
import { config } from "dotenv";

config();

build({
	bundle: true,
	entryPoints: ["src/index.ts"],
	external: ["@sentry/node", "@sentry/profiling-node", "polka"],
	format: "esm",
	minify: true,
	outdir: "./dist",
	platform: "node",
	sourcemap: true,
	plugins: [
		sentryEsbuildPlugin({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: "xosnrdev",
			project: "carai-rce",
		}),
	],
	target: ["esnext", "node14"],
	tsconfig: "tsconfig.json",
}).catch((e) => {
	/* eslint-disable-next-line */
	console.error(e);
	process.exit(1);
});
