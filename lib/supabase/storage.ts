/**
 * Supabase Storage Utilities
 * Handles file uploads for profile pictures, certificates, post images, etc.
 * Replaces Strapi's upload plugin
 */
import { getSupabaseClient } from './client';

// Storage bucket names
export const BUCKETS = {
  PROFILE_PICS: 'profile-pics',
  BACKGROUND_IMAGES: 'background-images',
  CERTIFICATES: 'certificates',
  PROJECT_IMAGES: 'project-images',
  POST_MEDIA: 'post-media',
  COMPANY_ASSETS: 'company-assets',
  VIDEOS: 'videos',
  GENERAL: 'general',
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: { message: string } | null;
}

export interface UploadOptions {
  /** Bucket to upload to */
  bucket: BucketName;
  /** Optional subfolder path (e.g., userId) */
  folder?: string;
  /** Custom file name (without extension) */
  fileName?: string;
  /** Whether to make the file publicly accessible (default: true) */
  public?: boolean;
  /** Content type override */
  contentType?: string;
}

/**
 * Upload a file to Supabase Storage
 * Replaces: uploadFile(file, token) and uploadImage(...)
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const supabase = getSupabaseClient();

  // Generate file path
  const fileExtension = file.name.split('.').pop() || '';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const baseName = options.fileName || file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${baseName}_${timestamp}_${randomStr}.${fileExtension}`;
  
  const filePath = options.folder 
    ? `${options.folder}/${fileName}`
    : fileName;

  try {
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: options.contentType || file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        url: null,
        path: null,
        error: { message: error.message },
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err) {
    console.error('Upload failed:', err);
    return {
      url: null,
      path: null,
      error: { message: 'Upload failed unexpectedly' },
    };
  }
}

/**
 * Upload a profile picture
 */
export async function uploadProfilePic(
  file: File,
  userId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    bucket: BUCKETS.PROFILE_PICS,
    folder: userId,
    fileName: 'profile',
  });
}

/**
 * Upload a background image
 */
export async function uploadBackgroundImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    bucket: BUCKETS.BACKGROUND_IMAGES,
    folder: userId,
    fileName: 'background',
  });
}

/**
 * Upload a certificate file
 */
export async function uploadCertificate(
  file: File,
  userId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    bucket: BUCKETS.CERTIFICATES,
    folder: userId,
  });
}

/**
 * Upload a project image
 */
export async function uploadProjectImage(
  file: File,
  projectId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    bucket: BUCKETS.PROJECT_IMAGES,
    folder: projectId,
  });
}

/**
 * Upload post media (images or videos)
 */
export async function uploadPostMedia(
  file: File,
  userId: string,
  postId?: string
): Promise<UploadResult> {
  const folder = postId ? `${userId}/${postId}` : userId;
  return uploadFile(file, {
    bucket: BUCKETS.POST_MEDIA,
    folder,
  });
}

/**
 * Upload a video
 */
export async function uploadVideo(
  file: File,
  userId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    bucket: BUCKETS.VIDEOS,
    folder: userId,
  });
}

/**
 * Upload a company asset (logo, cover image, etc.)
 */
export async function uploadCompanyAsset(
  file: File,
  companyId: string,
  assetType: 'logo' | 'cover' | 'photo'
): Promise<UploadResult> {
  return uploadFile(file, {
    bucket: BUCKETS.COMPANY_ASSETS,
    folder: companyId,
    fileName: assetType,
  });
}

/**
 * Upload an employer logo
 */
export async function uploadEmployerLogo(
  employerId: string,
  file: File
): Promise<UploadResult> {
  return uploadCompanyAsset(file, employerId, 'logo');
}

/**
 * Upload an employer background image
 */
export async function uploadEmployerBackgroundImage(
  employerId: string,
  file: File
): Promise<UploadResult> {
  return uploadCompanyAsset(file, employerId, 'cover');
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map(file => uploadFile(file, options))
  );
  return results;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Delete multiple files from storage
 */
export async function deleteFiles(
  bucket: BucketName,
  paths: string[]
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove(paths);

  if (error) {
    console.error('Delete error:', error);
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase = getSupabaseClient();
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Get signed URL for private files (expires after the specified duration)
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn = 3600 // 1 hour default
): Promise<{ url: string | null; error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    return { url: null, error: { message: error.message } };
  }

  return { url: data.signedUrl, error: null };
}

/**
 * List files in a bucket/folder
 */
export async function listFiles(
  bucket: BucketName,
  folder?: string
): Promise<{ files: string[]; error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder || '', {
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    return { files: [], error: { message: error.message } };
  }

  const files = data
    .filter((item: { name: string }) => item.name !== '.emptyFolderPlaceholder')
    .map((item: { name: string }) => folder ? `${folder}/${item.name}` : item.name);

  return { files, error: null };
}

/**
 * Move a file to a different location
 */
export async function moveFile(
  bucket: BucketName,
  fromPath: string,
  toPath: string
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .move(fromPath, toPath);

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Copy a file
 */
export async function copyFile(
  bucket: BucketName,
  fromPath: string,
  toPath: string
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .copy(fromPath, toPath);

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Get storage URL from a path (utility for migrating from Strapi URLs)
 * This function helps convert old Strapi media URLs or paths to Supabase Storage URLs
 */
export function getStorageUrl(
  pathOrUrl: string | null | undefined,
  bucket: BucketName = BUCKETS.GENERAL
): string | null {
  if (!pathOrUrl) return null;

  // If it's already a full URL, return it
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  // If it's a relative path, construct the Supabase Storage URL
  return getPublicUrl(bucket, pathOrUrl);
}

/**
 * Extract file path from a Supabase Storage URL
 */
export function extractPathFromUrl(url: string, bucket: BucketName): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  const bucketPath = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(bucketPath);
  
  if (index === -1) return null;
  
  return url.substring(index + bucketPath.length);
}
