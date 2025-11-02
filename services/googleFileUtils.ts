/**
 * Google Drive file information and utilities
 */

export interface GoogleFileInfo {
    fileId: string;
    isSlides: boolean;
    fileType: 'document' | 'presentation';
    originalUrl: string;
}

/**
 * Validates and extracts file information from various Google Drive URL formats
 * @param url - The Google Drive URL to validate and extract from
 * @returns GoogleFileInfo object or null if invalid
 */
export const getFileInfo = (url: string): GoogleFileInfo | null => {
    if (!url || typeof url !== 'string') {
        console.warn('Invalid URL provided to getFileInfo:', url);
        return null;
    }

    // Clean the URL
    const cleanUrl = url.trim();

    // Pattern 1: Standard Google Docs/Slides URL - https://docs.google.com/document/d/FILE_ID/edit
    const docsPattern = /\/document\/d\/([a-zA-Z0-9-_]+)/;
    const slidesPattern = /\/presentation\/d\/([a-zA-Z0-9-_]+)/;

    // Pattern 2: Drive open URL - https://drive.google.com/open?id=FILE_ID
    const driveOpenPattern = /[?&]id=([a-zA-Z0-9-_]+)/;

    // Pattern 3: Short /d/ URL - /d/FILE_ID or https://docs.google.com/d/FILE_ID
    const shortPattern = /\/d\/([a-zA-Z0-9-_]+)/;

    let fileId: string | null = null;
    let isSlides = false;

    // Check for docs URL
    const docsMatch = cleanUrl.match(docsPattern);
    if (docsMatch) {
        fileId = docsMatch[1];
        isSlides = false;
    }

    // Check for slides URL
    if (!fileId) {
        const slidesMatch = cleanUrl.match(slidesPattern);
        if (slidesMatch) {
            fileId = slidesMatch[1];
            isSlides = true;
        }
    }

    // Check for drive open URL
    if (!fileId) {
        const driveMatch = cleanUrl.match(driveOpenPattern);
        if (driveMatch) {
            fileId = driveMatch[1];
            // For drive.google.com/open?id= URLs, check for slides indicators
            isSlides = cleanUrl.includes('presentation') || cleanUrl.includes('slides');
        }
    }

    // Check for short /d/ URL
    if (!fileId) {
        const shortMatch = cleanUrl.match(shortPattern);
        if (shortMatch) {
            fileId = shortMatch[1];
            // For /d/ URLs, check for slides indicators
            isSlides = cleanUrl.includes('presentation') || cleanUrl.includes('slides');
        }
    }

    if (!fileId) {
        console.warn('Could not extract file ID from URL:', cleanUrl);
        return null;
    }

    return {
        fileId,
        isSlides,
        fileType: isSlides ? 'presentation' : 'document',
        originalUrl: cleanUrl
    };
};

/**
 * Generates a Google Drive export/download URL for the given file and format
 * @param fileInfo - The GoogleFileInfo object
 * @param format - The export format (e.g., 'pdf', 'docx', 'pptx')
 * @returns The complete export URL or null if invalid
 */
export const getDownloadUrl = (fileInfo: GoogleFileInfo | null, format: string): string | null => {
    if (!fileInfo || !fileInfo.fileId) {
        console.warn('Invalid file info provided to getDownloadUrl:', fileInfo);
        return null;
    }

    if (!format || typeof format !== 'string') {
        console.warn('Invalid format provided to getDownloadUrl:', format);
        return null;
    }

    // Determine file type based on format - format determines the export endpoint
    let useSlidesEndpoint = false;

    // Presentation formats should use slides endpoint
    if (['pptx', 'odp'].includes(format.toLowerCase())) {
        useSlidesEndpoint = true;
    }
    // Document formats should use docs endpoint
    else if (['docx', 'rtf', 'odt'].includes(format.toLowerCase())) {
        useSlidesEndpoint = false;
    }
    // For neutral formats like pdf, txt, use the original file type
    else {
        useSlidesEndpoint = fileInfo.isSlides;
    }

    const baseUrl = useSlidesEndpoint
        ? `https://docs.google.com/presentation/d/${fileInfo.fileId}/export`
        : `https://docs.google.com/document/d/${fileInfo.fileId}/export`;

    return `${baseUrl}?format=${format}`;
};

/**
 * Validates if a URL is a valid Google Drive file URL
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidGoogleFileUrl = (url: string): boolean => {
    return getFileInfo(url) !== null;
};

/**
 * Extracts file ID from URL with fallback to default type detection
 * @param url - The Google Drive URL
 * @param defaultIsSlides - Default assumption if type cannot be determined
 * @returns Object with fileId and isSlides, or null if invalid
 */
export const extractFileId = (url: string, defaultIsSlides: boolean = false): { fileId: string; isSlides: boolean } | null => {
    const fileInfo = getFileInfo(url);
    if (fileInfo) {
        return { fileId: fileInfo.fileId, isSlides: fileInfo.isSlides };
    }

    // Fallback: try to extract file ID even if type detection fails
    const patterns = [
        /\/d\/([a-zA-Z0-9-_]+)/,  // /d/FILE_ID
        /[?&]id=([a-zA-Z0-9-_]+)/ // ?id=FILE_ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return { fileId: match[1], isSlides: defaultIsSlides };
        }
    }

    return null;
};
