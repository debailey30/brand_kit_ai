import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client for Replit Object Storage
const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "https://object-storage.replit.com",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;

/**
 * Saves a base64 image to object storage
 * @param base64Data - The base64 image data (without the data:image/png;base64, prefix)
 * @param fileName - The name for the file
 * @param isPublic - Whether the file should be publicly accessible
 * @returns The URL to access the file
 */
export async function saveImageToStorage(
  base64Data: string,
  fileName: string,
  isPublic: boolean = true
): Promise<string> {
  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, "base64");
  
  // Determine the path based on public/private
  const key = isPublic 
    ? `public/generations/${fileName}` 
    : `.private/generations/${fileName}`;
  
  // Upload to object storage
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketId,
      Key: key,
      Body: buffer,
      ContentType: "image/png",
    })
  );
  
  // Return public URL
  if (isPublic) {
    return `https://object-storage.replit.com/${bucketId}/public/generations/${fileName}`;
  } else {
    // For private files, generate a presigned URL
    const command = new GetObjectCommand({
      Bucket: bucketId,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 }); // 7 days
  }
}

/**
 * Saves a brand kit asset to object storage
 */
export async function saveBrandKitAsset(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `.private/brand-kits/${fileName}`;
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketId,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );
  
  // Generate presigned URL for private access
  const command = new GetObjectCommand({
    Bucket: bucketId,
    Key: key,
  });
  
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 30 }); // 30 days
}
