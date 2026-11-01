<script lang="ts">
	import { parseSingleLine } from '$lib/services/configParser'; // or your path
	import type { LineRecord } from '$lib/types/schema_types';

	let {
		currentText = '',
		onAdd,
		onCancel,
		uuid
	}: {
		currentText: string;
		onAdd: (record: LineRecord, uuid?: string) => void;
		onCancel: () => void;
		uuid?: string;
	} = $props();

	// local state would not automatically track future changes to prop if not in a closure
	let draftText = $state((() => currentText)());

	function handleSave(e?: Event) {
		if (e) e.preventDefault();
		if (!draftText.trim()) {
			onCancel();
			return;
		}
		const newRecord = parseSingleLine(draftText, uuid);
		onAdd(newRecord);
		draftText = '';
		onCancel();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSave();
		} else if (e.key === 'Escape') {
			onCancel();
		}
	}
</script>

<tr class="add-line-row">
	<td colspan="3">
		<div class="input-container">
			<input
				type="text"
				bind:value={draftText}
				placeholder="e.g. hub: node_A 10 20 [color=blue]"
				onkeydown={handleKeydown}
			/>
			<button type="button" onclick={handleSave}>Save</button>
			<button type="button" onclick={onCancel}>Cancel</button>
		</div>
	</td>
</tr>

<style>
	.input-container {
		display: flex;
		gap: 8px;
		width: 100%;
	}
	input {
		flex: 1;
		padding: 4px 8px;
	}
</style>
