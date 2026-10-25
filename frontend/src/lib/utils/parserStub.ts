export async function parseConfigStub(rawText: string): Promise<{ success: boolean; message: string }> {
    // Stub function simulating future Python server parsing endpoint
    if (!rawText || rawText.trim().length === 0) {
        throw new Error("File content is empty.");
    }

    // Simulate network delay for the future backend call
    await new Promise(resolve => setTimeout(resolve, 100));

    // Confirm file read and contents received
    return {
        success: true,
        message: "File successfully loaded and passed through stub parser."
    };
}