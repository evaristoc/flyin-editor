<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import { buildGraphFromRecords } from '$lib/services/buildGraph';
	import { parseToLineRecords } from '$lib/services/configParser';
	import type { LineRecord, ParsedFileContext } from '$lib/types/schema_types';

	let lines = $state<LineRecord[]>([]);
	let isConfirmed = $state(false);

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
		setRawText(rawText: string) {
			lines = parseToLineRecords(rawText);
			isConfirmed = true;
		},
		updateLineText(index: number, newRaw: string) {
			// Target specific line index and re-parse just that entry or run pipeline
			const updatedRawLines = [...lines];
			updatedRawLines[index] = {
				...updatedRawLines[index],
				raw: newRaw
			};
			// Re-run parser or update specific record
			lines = parseToLineRecords(updatedRawLines.map((r) => r.raw).join('\n'));
			isConfirmed = false;
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
