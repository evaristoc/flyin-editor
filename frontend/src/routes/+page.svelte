<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import GraphRenderer from '$lib/components/GraphRenderer.svelte';
	import ConfigEditor from '$lib/components/ConfigEditor.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { getContext } from 'svelte';
	import { createRecord } from '../model/recordModel.svelte.ts';
	import type { Record, WorkspaceRegistry } from '$lib/types/schema_types';

	const workSpace: WorkspaceRegistry = getContext('workSpace');
	let dataStore = $state<Record | null>(null);
	let hasFiles = $derived(workSpace.contexts.size > 0);
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

<div class="app-layout">
	{hasFiles}
	{#if hasFiles}
		<Sidebar />
	{/if}
	<main class="fileload-container">
		<h1>Load Map Configuration</h1>

		{#if !dataStore || !dataStore.isConfirmed}
			<p>Drop your configuration text file below to begin.</p>
			<FileDropzone onFileLoaded={handleFileLoaded} />
		{:else}
			{workSpace.activeFile}
			<!-- {dataStore.fileid}
			{dataStore.isConfirmed} -->
			{workSpace.contexts.forEach((v) => console.log(v.fileid))}
			<h2>Graph Visualization</h2>
			<GraphRenderer />
			<ConfigEditor />
		{/if}
	</main>
</div>

<style>
	.app-layout {
		display: flex;
		height: 100vh;
	}
	.workspace-menu {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.6rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.fileload-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		text-align: center;
		font-family: sans-serif;
	}
</style>
