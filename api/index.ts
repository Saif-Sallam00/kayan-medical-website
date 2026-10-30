// Vercel serverless entry. vercel.json rewrites /api/*, /objects/* and every page
// route here; the Express app sees the original request path.
//
// The server code is pre-bundled to dist/server/vercel.js by `npm run build:server`
// (part of the Vercel build command). Importing the TypeScript source directly
// doesn't work on Vercel: Node ESM can't resolve the extensionless imports or
// the @shared/* path alias.
import type { IncomingMessage, ServerResponse } from "http";
import type { createVercelApp as CreateVercelApp } from "../server/vercel";
// @ts-ignore -- generated during the build
import { createVercelApp as createVercelAppBundled } from "../dist/server/vercel.js";

const createVercelApp = createVercelAppBundled as typeof CreateVercelApp;
const appPromise = createVercelApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await appPromise;
  return app(req as any, res as any);
}
