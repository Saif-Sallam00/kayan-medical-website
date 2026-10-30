// The Vercel function's app: the Express API plus server-rendered HTML for every
// page route (see seo.ts). Bundled to dist/server/vercel.js by `npm run build:server`.
import type { Express } from "express";
import { createApp } from "./app";
import { registerPages } from "./seo";
// @ts-ignore -- the built client HTML, inlined as a string by esbuild (--loader:.html=text)
import template from "../dist/public/index.html";

export async function createVercelApp(): Promise<Express> {
  const { app } = await createApp();
  registerPages(app, template as string);
  return app;
}
