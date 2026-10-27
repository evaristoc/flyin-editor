const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateConfigFile(file: File): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`
        };
    }

    // Validate text extension or standard plain text MIME types
    const isTextExtension = file.name.endsWith('.txt') || file.name.endsWith('.conf') || file.name.endsWith('.json') || file.name.endsWith('.cfg');
    const isTextMime = file.type.startsWith('text/') || file.type === '';

    if (!isTextExtension && !isTextMime) {
        return {
            valid: false,
            error: 'Unsupported file type. Please upload a plain text configuration file.'
        };
    }

    return { valid: true };
}
