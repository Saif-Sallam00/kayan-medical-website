// Object storage backed by Vercel Blob (replaces the Replit sidecar / GCS client).
//
// Objects keep the same public path format as before: `/objects/uploads/<uuid>`.
// That path is what gets stored in the database, and the `/objects/*` route
// resolves it to the blob with pathname `uploads/<uuid>`. Because the format is
// unchanged, images migrated from Replit only need to be copied to the same
// pathname in Blob — no database URL rewrite is required.
//
// Upload flow (unchanged for the frontend):
//   1. POST /api/objects/upload        -> { uploadURL }
//   2. browser PUTs the file to uploadURL
//   3. POST /api/objects/set-acl { imageUrl: uploadURL } -> { objectPath }
//
// BLOB_UPLOAD_MODE controls step 2:
//   - "presigned" (default): uploadURL is a short-lived presigned Vercel Blob
//     URL, so the browser uploads straight to Blob (no function body limit).
//   - "proxy": uploadURL is /api/objects/upload/<uuid> on this server, which
//     forwards the bytes to Blob with put(). Limited to ~4.5 MB on Vercel.
import { put, head, get, issueSignedToken, presignUrl } from "@vercel/blob";
import { randomUUID } from "crypto";
import type { Response } from "express";
import { Readable } from "stream";

const UPLOAD_PREFIX = "uploads/";
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // matches the 10 MB limit in ObjectUploader

type BlobAccess = "public" | "private";

function blobAccess(): BlobAccess {
  return process.env.BLOB_ACCESS === "private" ? "private" : "public";
}

function blobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. Connect a Vercel Blob store to the project.");
  }
  return token;
}

// Public blob URL for a pathname. Token format: vercel_blob_rw_<storeId>_<secret>
function publicBlobUrl(pathname: string): string {
  const [, , , storeId = ""] = blobToken().split("_");
  return `https://${storeId}.public.blob.vercel-storage.com/${pathname}`;
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  /** `/objects/uploads/<uuid>` -> `uploads/<uuid>` */
  objectPathToPathname(objectPath: string): string {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const pathname = decodeURIComponent(objectPath.slice("/objects/".length));
    if (!pathname || pathname.includes("..")) {
      throw new ObjectNotFoundError();
    }
    return pathname;
  }

  /** Streams or redirects to the blob behind `/objects/<pathname>`. */
  async sendObject(objectPath: string, res: Response, cacheTtlSec = 86400) {
    const pathname = this.objectPathToPathname(objectPath);

    if (blobAccess() === "public") {
      // Public blobs are served by Vercel's CDN; redirect so images don't use function bandwidth.
      res.set("Cache-Control", `public, max-age=${cacheTtlSec}`);
      return res.redirect(302, publicBlobUrl(pathname));
    }

    const result = await get(pathname, { access: "private", token: blobToken() });
    if (!result || result.statusCode !== 200) {
      throw new ObjectNotFoundError();
    }
    res.set({
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Cache-Control": `public, max-age=${cacheTtlSec}`,
    });
    Readable.fromWeb(result.stream as any).pipe(res);
  }

  /** Returns the URL the browser should PUT the file to. */
  async getObjectEntityUploadURL(): Promise<string> {
    const objectId = randomUUID();
    const pathname = `${UPLOAD_PREFIX}${objectId}`;

    if (process.env.BLOB_UPLOAD_MODE !== "proxy") {
      try {
        const validUntil = Date.now() + 15 * 60 * 1000;
        const signed = await issueSignedToken({
          token: blobToken(),
          pathname,
          operations: ["put"],
          validUntil,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
        });
        const { presignedUrl } = await presignUrl(signed, {
          operation: "put",
          pathname,
          access: blobAccess(),
          validUntil,
          addRandomSuffix: false,
          allowOverwrite: false,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          allowedContentTypes: ["image/*"],
        });
        return presignedUrl;
      } catch (error) {
        console.error("Presigned upload URL failed, falling back to proxy upload:", error);
      }
    }

    return `/api/objects/upload/${objectId}`;
  }

  /** Proxy-mode upload: stores the request body at `uploads/<objectId>`. */
  async uploadObjectEntity(objectId: string, body: Buffer, contentType: string): Promise<string> {
    if (!UUID_RE.test(objectId) || objectId.length !== 36) {
      throw new ObjectNotFoundError();
    }
    const pathname = `${UPLOAD_PREFIX}${objectId}`;
    await put(pathname, body, {
      access: blobAccess(),
      contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
      token: blobToken(),
    });
    return `/objects/${pathname}`;
  }

  /** Maps an upload URL (presigned or proxy) or an existing object path to `/objects/uploads/<uuid>`. */
  normalizeObjectEntityPath(rawPath: string): string {
    if (rawPath.startsWith("/objects/")) {
      return rawPath;
    }
    const match = rawPath.match(UUID_RE);
    if (!match) {
      return rawPath;
    }
    return `/objects/${UPLOAD_PREFIX}${match[0].toLowerCase()}`;
  }

  /**
   * Kept for route compatibility. Blob objects are public, so there is no ACL to
   * set; this just confirms the upload landed and returns the stored path.
   */
  async trySetObjectEntityAclPolicy(rawPath: string): Promise<string> {
    const objectPath = this.normalizeObjectEntityPath(rawPath);
    if (!objectPath.startsWith("/objects/")) {
      return objectPath;
    }
    try {
      await head(this.objectPathToPathname(objectPath), { token: blobToken() });
    } catch {
      throw new ObjectNotFoundError();
    }
    return objectPath;
  }
}
