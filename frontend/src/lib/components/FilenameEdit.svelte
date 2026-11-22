<script lang="ts">
	import type { Record } from '$lib/types/schema_types';
	import SVGFileDelete from './SVGFileDelete.svelte';
	import SVGFileSave from './SVGFileSave.svelte';
	import SVGFileEdit from './SVGFileIcon.svelte';
	import SVGFileIcon from './SVGFileEdit.svelte';
	import type { WorkspaceRegistry } from '$lib/services/WorkspaceRegistry';

	let { file, registry }: { file: Record; registry: WorkspaceRegistry } = $props();
	let isEditing = $state(false);
	let editName = $state('');
	let errorMessage = $state<string | null>(null);

	function startEditing() {
		editName = file.name;
		isEditing = true;
	}

	function handleRename() {
		const success = registry.renameFile(file.fileid, editName);
		if (success) {
			errorMessage = null;
			isEditing = false;
		} else {
			errorMessage = 'Name already exists or is invalid';
		}
	}

	function handleInput() {
		if (errorMessage) {
			errorMessage = null;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleRename();
		} else if (e.key === 'Escape') {
			isEditing = false;
			errorMessage = null;
		}
	}

	function handleSpanKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			startEditing();
		}
	}

	function handleDelete() {
		if (window.confirm('Are you sure you want to delete this file?')) {
			registry.setActiveFile(null);
			registry.removeContext(file.fileid);
			console.log(registry.contexts);
		}
	}
</script>

<div class="sidebar-item">
	{#if isEditing}
		<input
			type="text"
			bind:value={editName}
			onblur={handleRename}
			oninput={handleInput}
			onkeydown={handleKeydown}
		/>
		{#if errorMessage}
			<span class="error-text">{errorMessage}</span>
		{/if}
	{:else}
		<div class="file-meta">
			<SVGFileIcon />
			<span class="file-name" role="button" tabindex="0" onkeydown={handleSpanKeydown}
				>{file.name}</span
			>
		</div>
		<div class="file-actions">
			<button class="action-start" onclick={startEditing}><SVGFileEdit /></button>
			<button onclick={handleDelete}><SVGFileDelete /></button>
			{#if registry.activeFile === file.fileid}
				<button onclick={() => registry.saveActiveFile()}><SVGFileSave /></button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.sidebar-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
		min-width: 0;
	}

	.file-meta {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex: 1 1 auto;
		min-width: 0;
	}

	.file-name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex: 0 0 auto;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.file-actions button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.error-text {
		color: red;
		font-size: 0.85rem;
		display: block;
	}
</style>
