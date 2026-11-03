<script lang="ts">
	import { getContext } from 'svelte';
	import type { WorkspaceRegistry } from '$lib/types/schema_types';

	const workSpace = getContext<WorkspaceRegistry>('workSpace');
	let dataStore = $derived(
		workSpace.activeFile ? workSpace.contexts.get(workSpace.activeFile) : undefined
	);
	const recordsArray = $derived(Array.from(workSpace.contexts.values()));
	console.log(recordsArray);
	function handleCloseActive() {
		if (dataStore) dataStore.setIsConfirmed(false);
		dataStore = null;
		workSpace.setActiveFile(null);
	}
</script>

<aside class="sidebar">
	<h2>Workspace Files</h2>
	<div class="menu-actions">
		<button onclick={handleCloseActive}>Close Active</button>
	</div>
	<ul>
		{#each recordsArray as record (record.fileid)}
			<li>
				<button
					onclick={() => workSpace.setActiveFile(record.fileid)}
					class:active={workSpace.activeFile === record.fileid}
				>
					{record.name}
				</button>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.sidebar {
		width: 250px;
		border-right: 1px solid #ccc;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.menu-actions {
		display: flex;
		gap: 0.5rem;
	}
	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0;
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
</style>
