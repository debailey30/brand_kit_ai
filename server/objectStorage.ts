import { Storage, File } from "@google-cloud/storage";
import { randomUUID } from "crypto";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// The object storage client is used to interact with the object storage service.
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths.
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  /**
   * Saves a base64 image to object storage
   * @param base64Data - The base64 image data (without the data:image/png;base64, prefix)
   * @param fileName - The name for the file
   * @param isPublic - Whether the file should be publicly accessible
   * @returns The URL to access the file
   */
  async saveImageToStorage(
    base64Data: string,
    fileName: string,
    isPublic: boolean = true
  ): Promise<string> {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");
    
    let fullPath: string;
    
    if (isPublic) {
      // Get public search paths for the bucket
      const publicPaths = this.getPublicObjectSearchPaths();
      // Use the first public path
      fullPath = `${publicPaths[0]}/generations/${fileName}`;
    } else {
      // Use private object directory
      const privateDir = this.getPrivateObjectDir();
      fullPath = `${privateDir}/generations/${fileName}`;
    }
    
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);
    
    // Upload the buffer to object storage
    await file.save(buffer, {
      contentType: "image/png",
      metadata: {
        cacheControl: isPublic ? "public, max-age=3600" : "private, max-age=3600",
      },
    });
    
    // Return public URL
    if (isPublic) {
      return `https://storage.googleapis.com/${bucketName}/${objectName}`;
    } else {
      // For private files, generate a presigned URL
      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return signedUrl;
    }
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}
