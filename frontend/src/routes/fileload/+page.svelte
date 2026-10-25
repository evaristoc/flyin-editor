<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import { parseMapConfig } from '$lib/services/mapParser';
	import type { Graph } from '$lib/types/schema_types';

	let parsedGraph = $state<Graph | null>(null);

	function handleFileLoaded(text: string, filename: string) {
		try {
			const graph = parseMapConfig(text, filename);
			parsedGraph = graph;
		} catch (error) {
			console.error('Failed to parse map configuration:', error);
		}
	}
</script>

<main class="fileload-container">
	<h1>Load Map Configuration</h1>

	{#if !parsedGraph}
		<p>Drop your configuration text file below to begin.</p>
		<FileDropzone onFileLoaded={handleFileLoaded} />
	{:else}
		<div class="result-view">
			<h2>Successfully Loaded: {parsedGraph.name}</h2>
			<p>
				Nodes: {parsedGraph.nodes.length} | Edges: {parsedGraph.edges.length} | Drones: {parsedGraph.nb_drones}
			</p>
			<button onclick={() => (parsedGraph = null)}>Load Another File</button>
		</div>
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
	.result-view {
		margin-top: 20px;
	}
</style>
