import { SvelteMap } from "svelte/reactivity";

export class WorkspaceRegistry {
    fileIdState = $state<string | null>(null);
    contexts = new SvelteMap<string, RecordContext>();

    get activeFile() {
        return this.fileIdState;
    }

    setActiveFile(fileid: string | null) {
        if (fileid) {
            this.fileIdState = fileid;
            const record = this.contexts.get(fileid);
            console.log('in set active file')
            console.log(record);
            console.log(record.fileid)
            console.log(record.isConfirmed)
            if (record) {
                record.setIsConfirmed(true);
                console.log(record.isConfirmed);
            }
        } else {
            this.fileIdState = null;
        }
    }

    addContext(recordcontext: RecordContext) {
        if (!recordcontext.fileid) return;
        this.contexts.set(recordcontext.fileid, recordcontext);
        if (this.fileIdState) {
            this.fileIdState = recordcontext.fileid;
        }
    }

    removeContext(fileid: string) {
        this.contexts.delete(fileid);
        if (this.fileIdState === fileid) {
            const nextKey = this.contexts.keys().next().value;
            this.fileIdState = nextKey || null;
        }
    }
}