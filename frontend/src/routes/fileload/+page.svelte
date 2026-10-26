<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import { parseMapConfig } from '$lib/services/mapParser';
	import GraphRenderer from '$lib/components/GraphRenderer.svelte';
	import type { Graph } from '$lib/types/schema_types';
	import { getContext } from 'svelte';

	let parsedGraph = $state<Graph | null>(null);
	const dataStore = getContext('parsedFileContext');
	function handleFileLoaded(text: string, filename: string) {
		try {
			const parsed = parseMapConfig(text, filename);
			dataStore.setParsedData(parsed);
			// parsedGraph = dataStore.data;
		} catch (error) {
			console.error('Failed to parse map configuration:', error);
		}
	}

	// const dataStore = getContext('parsedFileContext');

	// function handleFileLoaded(text: string, filename: string) {
	// 	console.log('1. handleFileLoaded called', filename);

	// 	try {
	// 		const parsed = parseMapConfig(text, filename);
	// 		console.log('2. Parsed result:', parsed);

	// 		dataStore.setParsedData(parsed);
	// 		console.log('3. Store data:', dataStore.data);
	// 	} catch (error) {
	// 		console.error('Failed to parse map configuration:', error);
	// 	}
	// }

	// async function handleDrop(event: DragEvent) {
	// 	event.preventDefault();
	// 	console.log('0. Drop received');

	// 	const file = event.dataTransfer?.files?.[0];
	// 	if (!file) {
	// 		console.log('No file found');
	// 		return;
	// 	}

	// 	const text = await file.text();
	// 	handleFileLoaded(text, file.name);
	// }

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		console.log('DROP WORKS!', event.dataTransfer?.files);
	}
</script>

<main class="fileload-container">
	<div
		ondragover={(event) => event.preventDefault()}
		ondrop={handleFileLoaded}
		style="border: 2px dashed gray; padding: 50px; text-align: center;"
	>
		Drop a file here to test
	</div>
	<h1>Load Map Configuration</h1>

	{#if !dataStore.data}
		<p>Drop your configuration text file below to begin.</p>
		<FileDropzone onFileLoaded={handleFileLoaded} />
	{:else}
		{#if !dataStore.isConfirmed}
			<div class="result-view">
				<h2>Successfully Loaded: {dataStore.data.name}</h2>
				<p>
					Nodes: {dataStore.data.nodes.length} | Edges: {dataStore.data.edges.length} | Drones: {dataStore
						.data.nb_drones}
				</p>
				<button onclick={() => dataStore.confirmData()}>Confirm and Render Graph</button>
			</div>
		{:else}
			<h2>Graph Visualization</h2>
			<GraphRenderer solutionData={dataStore.data} />
		{/if}
		<div>
			<button onclick={() => dataStore.clearData()}>Load Another File</button>
		</div>
	{/if}
</main>

<!-- <main>
	<h1>Map Loader</h1>
	<FileDropzone onFileLoaded={handleFileLoaded} />
	<input type="file" onchange={(e) => console.log('Raw input changed:', e.target.files?.[0])} />
</main> -->

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
