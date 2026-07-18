<script lang="ts">
	import { onMount } from 'svelte';
	import { getSolutions, getSolution } from '$lib/api/solutions';
	import GraphRenderer from '$lib/components/GraphRenderer.svelte';
	// import { getSolutionsList, getSolutionContent } from '$lib/api/solutions';
	import { parseMapConfig } from '$lib/utils/mapParser';
	import type { Graph } from '$lib/types/schema_types';

	let fileNames = $state([]);
	let selectedSolution = $state<Graph>(null);
	// let error = $state(null);

	onMount(() => {
		fileNames = getSolutions();
	});

	async function loadSolution(name: string) {
		try {
			let data = await getSolution(name);
			console.log('RAW TEXT FROM API:\n', data);
			selectedSolution = parseMapConfig(data, name);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="app-layout">
	<aside class="sidebar">
		<h2>Solutions</h2>
		<ul>
			{#each fileNames as name}
				<li>
					<button
						on:click={() => loadSolution(name)}
						class:active={selectedSolution?.name === name}
					>
						{name}
					</button>
				</li>
			{/each}
		</ul>
	</aside>

	<main class="main-content">
		{#if selectedSolution}
			<GraphRenderer solutionData={selectedSolution} />
		{:else}
			<div class="empty-state">
				<p>Please select a solution from the sidebar to view the graph output.</p>
			</div>
		{/if}
	</main>
</div>

<style>
	.app-layout {
		display: flex;
		height: 100vh;
	}
	.sidebar {
		width: 250px;
		border-right: 1px solid #ccc;
		padding: 1rem;
	}
	.sidebar ul {
		list-style: none;
		padding: 0;
	}
	.sidebar button {
		width: 100%;
		text-align: left;
		padding: 0.5rem;
		margin-bottom: 0.25rem;
		background: none;
		border: 1px solid transparent;
		cursor: pointer;
	}
	.sidebar button.active {
		background-color: #f0f0f0;
		border-color: #bbb;
	}
	.main-content {
		flex: 1;
		padding: 1rem;
	}
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #666;
	}
</style>
