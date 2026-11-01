<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import { buildGraphFromRecords } from '$lib/services/buildGraph';
	import { parseToLineRecords } from '$lib/services/configParser';
	import type { LineRecord, ParsedFileContext } from '$lib/types/schema_types';

	let lines = $state<LineRecord[]>([]);
	let isConfirmed = $state(false);
	let hoveredUuid = $state<string | null>(null);
	let selectedUuid = $state<string | null>(null);

	const dataStore = {
		get lines() {
			return lines;
		},
		get data() {
			// Automatically project the graph from lines
			return buildGraphFromRecords(lines, 'current_map');
		},
		get configFileView() {
			// Reconstruct raw text from the line records array
			return lines.map((r) => r.raw).join('\n');
		},
		get isConfirmed() {
			return isConfirmed;
		},
		get hoveredUuid() {
			return hoveredUuid;
		},
		get selectedUuid() {
			return selectedUuid;
		},
		setRawText(rawText: string) {
			lines = parseToLineRecords(rawText);
			isConfirmed = true;
		},
		updateLine(modifiedRecord: LineRecord) {
			// Target specific line index and re-parse just that entry or run pipeline
			const index = lines.findIndex((item) => item.uuid === modifiedRecord.uuid);
			// TODO it should be null or one value only: check later!
			if (index === -1) return;
			lines[index] = modifiedRecord;
		},
		addLine(newRecord: LineRecord) {
			// Collect current raw strings plus the new one
			lines = [...lines, newRecord];
		},
		moveLine(sourceUuid: string, targetUuid: string) {
			const sourceIndex = lines.findIndex((l) => l.uuid === sourceUuid);
			const targetIndex = lines.findIndex((l) => l.uuid === targetUuid);
			if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return;
			// Create a shallow copy of the array
			const updatedLines = [...lines];
			// Remove the source item
			const [movedItem] = updatedLines.splice(sourceIndex, 1);
			// Find the new target index after removal
			const newTargetIndex = updatedLines.findIndex((l) => l.uuid === targetUuid);
			// Insert the moved item at the target position
			updatedLines.splice(newTargetIndex, 0, movedItem);
			// Assign back to lines to trigger reactivity
			lines = updatedLines;
		},
		setHovered(uuid: string | null) {
			hoveredUuid = uuid;
		},
		setSelected(uuid: string | null) {
			selectedUuid = uuid;
		},
		confirmData() {
			isConfirmed = true;
		},
		clearData() {
			lines = [];
			isConfirmed = false;
		}
	};

	setContext<ParsedFileContext>('parsedFileContext', dataStore);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
