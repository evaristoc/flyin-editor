<script lang="ts">
	import { getContext } from 'svelte';
	import AddLineRecord from './AddLineRecord.svelte';
	import type { ParsedFileContext, LineRecord } from '$lib/types/schema_types';

	const dataStore = getContext<ParsedFileContext>('parsedFileContext');
	let lines = $derived(dataStore?.lines || []);
	let isAdding: boolean = $state(false);
	let isUuidEditing = $state<string | null>(null);
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
	function handleEditRecord(modifiedRecord: LineRecord) {
		dataStore.updateLine(modifiedRecord);
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
						<tr data-line-number={index + 1}>
                            <td class="line-number">{index + 1}</td>
                            <td class="line-content">
                                {#if isUuidEditing === line.uuid}
									<AddLineRecord
										currentText={line.raw}
										uuid={line.uuid}
										onAdd={handleEditRecord}
										onCancel={() => (isUuidEditing = null)}
									/>
								{:else}
									<code ondblclick={(e) => isEdit(e, line.uuid)}>{line.raw}</code>
								{/if}
                            </td>
                        </tr>
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

	.line-number {
		user-select: none;
		color: #94a3b8;
		text-align: right;
		padding-right: 16px;
		min-width: 30px;
		border-right: 1px solid #e2e8f0;
		margin-right: 12px;
	}

	.config-table {
		width: 100%;
		border-collapse: collapse;
		font-family: monospace;
		font-size: 14px;
	}

	tr:hover {
		background-color: #f1f5f9;
	}

	.line-number {
		user-select: none;
		color: #94a3b8;
		text-align: right;
		padding: 2px 16px 2px 12px;
		width: 1%;
		white-space: nowrap;
		border-right: 1px solid #e2e8f0;
		vertical-align: top;
	}

	.line-content {
		padding: 2px 12px;
		white-space: pre-wrap;
		word-break: break-all;
		vertical-align: top;
		white-space: nowrap;
	}
</style>
