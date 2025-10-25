import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export class ObjectNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ObjectNotFoundError";
  }
}

// Simple file-based storage service
export class LocalStorageService {
  private baseDir: string;

  constructor() {
    // Use a local directory for file storage
    this.baseDir = path.resolve(process.cwd(), ".storage");
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      path.join(this.baseDir, "public", "generations"),
      path.join(this.baseDir, "private", "generations"),
    ];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Saves a base64 image to local storage
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

    const subDir = isPublic ? "public" : "private";
    const filePath = path.join(this.baseDir, subDir, "generations", fileName);

    // Save the file
    await fs.promises.writeFile(filePath, buffer);

    // Return URL path (will be served by Express static middleware)
    if (isPublic) {
      return `/storage/public/generations/${fileName}`;
    } else {
      // For private files, we'll use a signed URL approach or just return the path
      // In a real app, you'd generate a temporary signed URL
      return `/api/storage/private/generations/${fileName}`;
    }
  }

  /**
   * Get a file from private storage
   */
  async getPrivateFile(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseDir, "private", filePath);

    if (!fs.existsSync(fullPath)) {
      throw new ObjectNotFoundError(`File not found: ${filePath}`);
    }

    return await fs.promises.readFile(fullPath);
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(filePath: string, isPublic: boolean = true): Promise<void> {
    const subDir = isPublic ? "public" : "private";
    const fullPath = path.join(this.baseDir, subDir, filePath);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }
}

export const localStorageService = new LocalStorageService();
