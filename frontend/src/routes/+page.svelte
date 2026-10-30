<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import GraphRenderer from '$lib/components/GraphRenderer.svelte';
	import ConfigEditor from '$lib/components/ConfigEditor.svelte';
	import { getContext } from 'svelte';
	import type { ParsedFileContext } from '$lib/types/schema_types';

	const dataStore: ParsedFileContext = getContext('parsedFileContext');
	function handleFileLoaded(text: string, filename: string) {
		try {
			dataStore.setRawText(text);
		} catch (error) {
			console.error('Failed to parse map configuration:', error);
		}
	}
</script>

<main class="fileload-container">
	<h1>Load Map Configuration</h1>

	{#if !dataStore.isConfirmed}
		<p>Drop your configuration text file below to begin.</p>
		<FileDropzone onFileLoaded={handleFileLoaded} />
	{:else}
		<h2>Graph Visualization</h2>
		<GraphRenderer solutionData={dataStore.data} />
		<ConfigEditor />
	{/if}
</main>

<style>
	.dropzone {
		border: 2px dashed #ccc;
		padding: 20px;
		text-align: center;
		cursor: pointer;
	}

	.dragging {
		border-color: #000;
		background: #f9f9f9;
	}
	.fileload-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		text-align: center;
		font-family: sans-serif;
	}
	.result-view {
		margin-top: 20px;
	}
</style>
