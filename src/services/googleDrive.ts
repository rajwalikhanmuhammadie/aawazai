/**
 * Google Drive API Integration Service
 * Manages dedicated "My Generated Voices" folder in Google Drive,
 * automatic uploads of generated audio files, and file deletions.
 */

const TOKEN_STORAGE_KEY = 'gdrive_access_token';
const FOLDER_ID_STORAGE_KEY = 'gdrive_app_folder_id';
const DEFAULT_FOLDER_NAME = 'My Generated Voices';
const DEFAULT_TIMEOUT_MS = 12000;

export interface DriveUploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink?: string;
  folderId: string;
}

export function getStoredDriveToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeDriveToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to access sessionStorage for Drive token:', e);
  }
}

/**
 * Fetch with automatic AbortController timeout to prevent UI hanging
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Ensures the dedicated "My Generated Voices" folder exists in Google Drive
 */
export async function getOrCreateVoicesFolder(accessToken: string): Promise<string> {
  // Check cached folder ID first
  const cachedFolderId = sessionStorage.getItem(FOLDER_ID_STORAGE_KEY);
  if (cachedFolderId) {
    try {
      const verifyRes = await fetchWithTimeout(
        `https://www.googleapis.com/drive/v3/files/${cachedFolderId}?fields=id,trashed`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        5000
      );
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (!verifyData.trashed) {
          return cachedFolderId;
        }
      }
    } catch {
      // If verification times out or fails, search for folder
    }
  }

  // Search for existing folder named "My Generated Voices"
  const query = encodeURIComponent(
    `name = '${DEFAULT_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetchWithTimeout(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    8000
  );

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    throw new Error(`Failed to query Google Drive: ${searchRes.status} ${errorText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    const folderId = searchData.files[0].id;
    sessionStorage.setItem(FOLDER_ID_STORAGE_KEY, folderId);
    return folderId;
  }

  // Create folder if not found
  const createRes = await fetchWithTimeout(
    'https://www.googleapis.com/drive/v3/files',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: DEFAULT_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Directory for audio files generated via AawazAI Voice Studio',
      }),
    },
    8000
  );

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Drive folder: ${createRes.status} ${errorText}`);
  }

  const newFolder = await createRes.json();
  sessionStorage.setItem(FOLDER_ID_STORAGE_KEY, newFolder.id);
  return newFolder.id;
}

/**
 * Uploads a base64 WAV audio file to Google Drive using multipart upload
 */
export async function uploadAudioToDrive(
  accessToken: string,
  item: {
    title: string;
    voiceName: string;
    audioBase64: string;
    createdAt?: number;
    text?: string;
  }
): Promise<DriveUploadResult> {
  const folderId = await getOrCreateVoicesFolder(accessToken);

  // Convert base64 to binary byte array
  const byteChars = atob(item.audioBase64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNums);
  const audioBlob = new Blob([byteArray], { type: 'audio/wav' });

  // Safe file name
  const cleanTitle = (item.title || 'voice_clip')
    .replace(/[^a-zA-Z0-9_\u0600-\u06FF\s-]/g, '')
    .trim()
    .substring(0, 30);
  const dateStr = new Date(item.createdAt || Date.now()).toISOString().split('T')[0];
  const fileName = `AawazAI_${item.voiceName}_${cleanTitle}_${dateStr}.wav`;

  // Multipart body construction
  const boundary = '-------AawazAiUploadBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'audio/wav',
    parents: [folderId],
    description: `Generated by AawazAI Voice Studio (${item.voiceName} Voice)\nScript: ${(item.text || '').substring(0, 200)}`,
  };

  const metadataString = JSON.stringify(metadata);

  // Build multipart form body
  const bodyParts = [
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    metadataString,
    delimiter,
    'Content-Type: audio/wav\r\n\r\n',
    audioBlob,
    closeDelimiter,
  ];

  const fullBlob = new Blob(bodyParts);

  const uploadRes = await fetchWithTimeout(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: fullBlob,
    },
    15000
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Google Drive upload failed: ${uploadRes.status} ${errorText}`);
  }

  const uploadData = await uploadRes.json();

  return {
    fileId: uploadData.id,
    webViewLink: uploadData.webViewLink || `https://drive.google.com/file/d/${uploadData.id}/view`,
    webContentLink: uploadData.webContentLink,
    folderId,
  };
}

/**
 * Permanently deletes or trashes an audio file from Google Drive
 */
export async function deleteFileFromDrive(accessToken: string, fileId: string): Promise<boolean> {
  if (!fileId) return false;
  try {
    const res = await fetchWithTimeout(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      6000
    );

    return res.status === 204 || res.status === 404;
  } catch (e) {
    console.warn(`Failed to delete file ${fileId} from Drive:`, e);
    return false;
  }
}
