<script lang="ts">
	import { getContext } from 'svelte';
	import FilenameEdit from './FilenameEdit.svelte';
	import type { WorkspaceRegistry } from '$lib/types/schema_types';

	const workSpace = getContext<WorkspaceRegistry>('workSpace');
	const recordsArray = $derived(Array.from(workSpace.contexts.values()));
	function handleCloseActive() {
		workSpace.setActiveFile(null);
	}
</script>

<aside class="sidebar">
	<h2>Workspace Files</h2>
	<ul>
		{#each recordsArray as record (record.fileid)}
			<li>
				<button
					onclick={() => workSpace.setActiveFile(record.fileid)}
					class:active={workSpace.activeFile === record.fileid}
				>
					<FilenameEdit file={record} registry={workSpace} />
				</button>
			</li>
		{/each}
	</ul>
	<div class="menu-actions">
		<button class="link-btn" onclick={handleCloseActive}>Add a new file...</button>
	</div>
</aside>

<style>
	.sidebar {
		width: 20vw;
		border-right: 1px solid #ccc;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
		background: rgba(219, 234, 254, 0.4);
	}
	.sidebar button {
		font-family: inherit;
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
	.sidebar button:hover {
		background: #f1f5f9;
	}
	.sidebar button.active {
		background-color: #f0f0f0;
		border-color: #bbb;
		border-radius: 5px;
	}
	.link-btn {
		padding: 0;
		border: none;
		background: transparent;
		color: #475569;
		font-family: inherit;
		font-size: inherit;
		text-decoration: none;
		cursor: pointer;
	}

	.link-btn:hover {
		color: #0f172a;
	}

	.link-btn:focus-visible {
		outline: 2px solid #475569;
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
