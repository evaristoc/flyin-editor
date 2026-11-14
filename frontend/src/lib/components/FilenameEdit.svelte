<script lang="ts">
	import type { Record } from '$lib/types/schema_types';
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
		<span
			role="button"
			tabindex="0"
			onkeydown={handleSpanKeydown}
			ondblclick={() => (isEditing = true)}>{file.name}</span
		>
		<button onclick={startEditing}>Rename</button>
		<button onclick={handleDelete}>Delete</button>
		{#if registry.activeFile === file.fileid}
			<button onclick={() => registry.saveActiveFile()}>Save</button>
		{/if}
	{/if}
</div>

<style>
	.error-text {
		color: red;
		font-size: 0.85rem;
		display: block;
	}
</style>
