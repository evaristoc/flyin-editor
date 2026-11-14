import { SvelteMap } from "svelte/reactivity";

export class WorkspaceRegistry {
    private exportHandler: (() => void) | null = null;
    fileIdState = $state<string | null>(null);
    contexts = new SvelteMap<string, RecordContext>();

    get activeFile() {
        return this.fileIdState;
    }

    setActiveFile(fileid: string | null) {
        if (fileid) {
            this.fileIdState = fileid;
        } else {
            this.fileIdState = null;
        }
    }

    renameFile(fileid: string, newName: string): boolean {
        const trimmedName = newName.trim();
        if (!trimmedName) return false;

        // Check if another record already uses this name
        for (const [id, record] of this.contexts) {
            if (id !== fileid && record.name === trimmedName) {
                return false; // Name collision detected
            }
        }

        const record = this.contexts.get(fileid);
        if (record) {
            record.setName(trimmedName);
            return true;
        }
        return false;
    }

    addContext(recordcontext: RecordContext) {
        if (!recordcontext.fileid) return;
        this.contexts.set(recordcontext.fileid, recordcontext);
        if (this.fileIdState) {
            this.fileIdState = recordcontext.fileid;
        }
    }

    removeContext(fileid: string) {
        if (this.fileIdState === fileid) {
            this.fileIdState = null;
        }
        this.contexts.delete(fileid);
        if (this.fileIdState === fileid) {
            const nextKey = this.contexts.keys().next().value ?? null;
            this.setActiveFile(nextKey);
        }
    }

    registerExportHandler(handler: (() => void) | null) {
        this.exportHandler = handler;
    }

    saveActiveFile() {
        if (!this.fileIdState) {
            return false;
        }
        if (this.exportHandler) {
            this.exportHandler();
            return true;
        }
        const context = this.contexts.get(this.fileIdState);
        if (!context) {
            return false;
        }
        const blob = new Blob([context.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = context.title || 'config.txt';
        link.click();
        URL.revokeObjectURL(url);
        return true;
    }

}