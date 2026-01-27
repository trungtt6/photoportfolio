import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// OAuth2 client configuration
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials from refresh token
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Folder structure constants
const FOLDER_STRUCTURE = {
  ROOT: process.env.GOOGLE_DRIVE_FOLDER_ID!,
  ORIGINALS: 'originals',
  PROCESSED: 'processed',
  THUMBNAILS: 'thumbnails',
};

// Create folder if it doesn't exist
async function createFolder(name: string, parentId: string): Promise<string> {
  try {
    // Check if folder already exists
    const response = await drive.files.list({
      q: `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    // Create new folder
    const folder = await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
      fields: 'id',
    });

    return folder.data.id!;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// Initialize folder structure
export async function initializeFolders(category: string): Promise<{
  originals: string;
  processed: string;
  thumbnails: string;
}> {
  // Create category folder in root
  const categoryFolderId = await createFolder(category, FOLDER_STRUCTURE.ROOT);

  // Create subfolders
  const originals = await createFolder(FOLDER_STRUCTURE.ORIGINALS, categoryFolderId);
  const processed = await createFolder(FOLDER_STRUCTURE.PROCESSED, categoryFolderId);
  const thumbnails = await createFolder(FOLDER_STRUCTURE.THUMBNAILS, categoryFolderId);

  return { originals, processed, thumbnails };
}

// Upload file to Google Drive
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string,
  metadata?: { [key: string]: string }
): Promise<{ fileId: string; webViewLink: string }> {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        properties: metadata,
      },
      media: {
        mimeType,
        body: require('stream').Readable.from(fileBuffer),
      },
      fields: 'id, webViewLink',
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink!,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Delete file from Google Drive
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await drive.files.delete({
      fileId,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Get file info
export async function getFileInfo(fileId: string) {
  try {
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, webViewLink, size, createdTime',
    });
    return response.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
}

// List files in folder
export async function listFiles(folderId: string) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, webViewLink, size, createdTime)',
      orderBy: 'createdTime desc',
    });
    return response.data.files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
