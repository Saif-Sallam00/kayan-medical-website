// Local / long-running entry: `npm run dev` and `npm start`.
// On Vercel the app is served by api/index.ts instead (no listen()).
import { createApp } from "./app";
import { setupVite, serveStatic } from "./vite";
import { log } from "./log";

(async () => {
  const { app, server } = await createApp();

  // Only set up Vite in development, after the API routes,
  // so the catch-all route doesn't interfere with them.
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
