// One-off migration: copies uploaded images from the live Replit site into
// Vercel Blob at the same pathname (uploads/<uuid>), so /objects/uploads/<uuid>
// URLs stored in the database keep working. Runs during the Vercel build, where
// BLOB_READ_WRITE_TOKEN is available. Idempotent: skips blobs that already exist.
// Never fails the build. Delete this script (and its build step) after cutover.
import { list, put } from "@vercel/blob";
import { readFileSync } from "fs";

const SOURCE = process.env.REPLIT_OBJECTS_SOURCE || "https://kayanmedical.store";
const ids = JSON.parse(readFileSync(new URL("./replit-object-ids.json", import.meta.url), "utf8"));

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("[migrate-objects] BLOB_READ_WRITE_TOKEN not set, skipping");
    return;
  }

  const existing = new Set();
  let cursor;
  do {
    const page = await list({ prefix: "uploads/", cursor, limit: 1000 });
    page.blobs.forEach((b) => existing.add(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const todo = ids.filter((id) => !existing.has(`uploads/${id}`));
  console.log(`[migrate-objects] ${ids.length} total, ${existing.size} already in Blob, ${todo.length} to copy`);

  let copied = 0;
  const failed = [];
  const worker = async () => {
    while (todo.length) {
      const id = todo.shift();
      try {
        const res = await fetch(`${SOURCE}/objects/uploads/${id}`, { signal: AbortSignal.timeout(30000) });
        if (!res.ok) throw new Error(`source ${res.status}`);
        const body = Buffer.from(await res.arrayBuffer());
        await put(`uploads/${id}`, body, {
          access: "public",
          contentType: res.headers.get("content-type") || "application/octet-stream",
          addRandomSuffix: false,
          allowOverwrite: false,
        });
        copied++;
      } catch (error) {
        failed.push(`${id}: ${error.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));

  console.log(`[migrate-objects] copied ${copied}, failed ${failed.length}`);
  failed.forEach((f) => console.log(`[migrate-objects] FAILED ${f}`));
}

// Hard cap so a slow/unreachable source can never stall the build.
const guard = setTimeout(() => {
  console.log("[migrate-objects] timed out after 5 minutes, continuing build");
  process.exit(0);
}, 5 * 60 * 1000);

main()
  .catch((error) => console.log("[migrate-objects] aborted:", error.message))
  .finally(() => clearTimeout(guard));
