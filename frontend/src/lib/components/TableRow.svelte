<script lang="ts">
	import { getContext } from 'svelte';
	import AddLineRecord from './AddLineRecord.svelte';
	import type { ParsedFileContext, LineRecord } from '$lib/types/schema_types';
	const dataStore = getContext<ParsedFileContext>('parsedFileContext');

	let {
		index,
		line,
		isUuidEditing,
		isEdit
	}: {
		index: number;
		line: LineRecord;
		isUuidEditing: string | null;
		isEdit: (e: MouseEvent, uuid: string) => void;
	} = $props();

	let isDragging = $state(false);
	let rowElement = $state<HTMLTableRowElement | null>(null);

	$effect(() => {
		if (dataStore.selectedUuid === line.uuid && rowElement) {
			rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});

	function handleDragStart(e: DragEvent) {
		if (e.dataTransfer) {
			e.dataTransfer.setData('text/plain', line.uuid);
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (!e.dataTransfer) return;

		const sourceUuid = e.dataTransfer.getData('text/plain');
		const targetUuid = line.uuid; // This is the target row's UUID

		if (!sourceUuid || sourceUuid === targetUuid) return;

		dataStore.moveLine(sourceUuid, targetUuid);
	}

	function handleMouseEnter() {
		dataStore.setHovered(line.uuid);
	}

	function handleMouseLeave() {
		dataStore.setHovered(null);
	}

	function handleClick() {
		dataStore.setSelected(line.uuid);
	}

	function handleEditRecord(modifiedRecord: LineRecord) {
		dataStore.updateLine(modifiedRecord);
	}
</script>

<tr
	draggable={true}
	class:drag-over={isDragging}
	class:highlighted={dataStore.hoveredUuid === line.uuid || dataStore.selectedUuid === line.uuid}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	data-line-number={index + 1}
	ondragstart={handleDragStart}
	ondragenter={handleDragEnter}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
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

<style>
	.line-number {
		user-select: none;
		color: #94a3b8;
		text-align: right;
		padding-right: 16px;
		min-width: 30px;
		border-right: 1px solid #e2e8f0;
		margin-right: 12px;
	}
	tr {
		transition: background-color 0.15s ease;
	}
	tr:hover {
		background-color: #f1f5f9;
	}

	tr.drag-over {
		background-color: #e2e8f0;
		border-top: 2px solid #3b82f6;
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
