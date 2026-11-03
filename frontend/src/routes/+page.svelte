<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import GraphRenderer from '$lib/components/GraphRenderer.svelte';
	import ConfigEditor from '$lib/components/ConfigEditor.svelte';
	import { getContext } from 'svelte';
	import { createRecord } from '../model/recordModel';
	import type { Record, WorkspaceRegistry } from '$lib/types/schema_types';

	const workSpace: WorkspaceRegistry = getContext('workSpace');
	let dataStore = $state<Record | null>(null);
	function handleFileLoaded(text: string, filename: string, fileid: string) {
		try {
			workSpace.addContext(createRecord(fileid, filename, text));
			if (fileid) workSpace.setActiveFile(fileid);
			dataStore = workSpace.contexts.get(fileid);
		} catch (error) {
			console.error('Failed to parse map configuration:', error);
		}
	}
</script>

<main class="fileload-container">
	<h1>Load Map Configuration</h1>

	{#if !dataStore || !dataStore.isConfirmed}
		<p>Drop your configuration text file below to begin.</p>
		<FileDropzone onFileLoaded={handleFileLoaded} />
	{:else}
		{workSpace.activeFile}
		{dataStore.fileid}
		<h2>Graph Visualization</h2>
		<GraphRenderer />
		<ConfigEditor />
	{/if}
</main>

<style>
	.fileload-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		text-align: center;
		font-family: sans-serif;
	}
</style>
