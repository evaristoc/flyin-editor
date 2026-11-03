<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import { buildGraphFromRecords } from '$lib/services/buildGraph';
	import { parseToLineRecords } from '$lib/services/configParser';
	import type { Record, WorkspaceRegistry } from '$lib/types/schema_types';

	let fileIdState = $state<string | null>(null);
	let contexts = $state(new Map<string, Record>());
	// const REGISTRY_KEY = Symbol('WorkspaceRegistry');

	const workSpace: WorkspaceRegistry = {
		get activeFile() {
			return fileIdState;
		},
		get contexts() {
			return contexts;
		},
		setActiveFile(fileid: string) {
			if (contexts.has(fileid)) {
				fileIdState = fileid;
			}
		},
		addContext(recordcontext: Record) {
			if (!recordcontext.fileid) return;
			contexts.set(recordcontext.fileid, recordcontext);
			if (fileIdState) {
				fileIdState = recordcontext.fileid;
			}
		},

		removeContext(fileid: string) {
			contexts.delete(fileid);
			if (fileIdState == fileid) {
				const nextKey = contexts.keys().next().value;
				fileIdState = nextKey || null;
			}
		}
	};

	setContext<WorkspaceRegistry>('workSpace', workSpace);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
