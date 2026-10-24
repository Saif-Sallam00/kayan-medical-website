// Vercel serverless entry. vercel.json rewrites /api/* and /objects/* here;
// the Express app sees the original request path.
//
// The server code is pre-bundled to dist/server/app.js by `npm run build:server`
// (part of the Vercel build command). Importing the TypeScript source directly
// doesn't work on Vercel: Node ESM can't resolve the extensionless imports or
// the @shared/* path alias.
import type { IncomingMessage, ServerResponse } from "http";
import type { createApp as CreateApp } from "../server/app";
// @ts-ignore -- generated during the build
import { createApp as createAppBundled } from "../dist/server/app.js";

const createApp = createAppBundled as typeof CreateApp;
const appPromise = createApp().then(({ app }) => app);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await appPromise;
  return app(req as any, res as any);
}
