<script lang="ts">
	import { getContext } from 'svelte';
	import AddLineRecord from './AddLineRecord.svelte';
	import TableRow from './TableRow.svelte';
	import type { WorkspaceRegistry, LineRecord } from '$lib/types/schema_types';

	const workSpace = getContext<WorkspaceRegistry>('workSpace');
	const dataStore = $derived(workSpace.contexts.get(workSpace.activeFile));
	let lines = $derived(dataStore?.lines || []);
	let isAdding: boolean = $state(false);
	// let errorMessage: string = $state('');
	let isUuidEditing = $state<string | null>(null);
	let isDragging: boolean = $state(false);

	function handleAddRecord(newRecord: LineRecord) {
		dataStore.addLine(newRecord);
		// // Test verification logs
		// console.log('Newly added record:', newRecord);
		// console.log('Complete lines store:', dataStore.lines);
		isAdding = false;
	}

	function isEdit(e: MouseEvent, uuid: string) {
		e.preventDefault();
		isUuidEditing = uuid;
	}

	// // Test verification logs
	// console.log('Newly added record:', newRecord);
	// console.log('Complete lines store:', dataStore.lines);
</script>

{#if lines}
	<div class="viewer-container">
		<h3>Configuration Text View</h3>
		<pre class="config-display">
            <table class="config-table">
                <tbody>
                    {#each lines as line, index (line.uuid)}
						<TableRow {isUuidEditing} {index} {line} {isEdit} />
					{/each}
                    {#if isAdding}
						<AddLineRecord
							currentText=""
							onAdd={handleAddRecord}
							onCancel={() => (isAdding = false)}
						/>
					{/if}
                </tbody>
            </table>
            {#if !isAdding}
				<button type="button" onclick={() => (isAdding = true)}>+ Add Line</button>
			{/if}
        </pre>
	</div>
{/if}

<style>
	.viewer-container {
		margin-top: 20px;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 16px;
		background-color: #f9f9f9;
	}

	.config-display {
		max-height: 400px;
		overflow-y: auto;
		white-space: pre-wrap;
		word-break: break-all;
		font-family: monospace;
		margin: 0;
		padding: 12px;
		background-color: #fff;
		border: 1px solid #e0e0e0;
		text-align: left;
	}

	.config-table {
		width: 100%;
		border-collapse: collapse;
		font-family: monospace;
		font-size: 14px;
	}
</style>
