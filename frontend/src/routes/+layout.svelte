<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import type { Graph } from '$lib/types/schema_types';

	interface ParsedFileContext {
		data: {
			name: string;
			nodes: unknown[];
			edges: unknown[];
			nb_drones: number;
		} | null;
		isConfirmed: boolean;
		setParsedData: (data: Graph) => void;
		confirmData: () => void;
		clearData: () => void;
	}

	let parsedData = $state(null);
	let isConfirmed = $state(false);

	const dataStore = {
		get data() {
			return parsedData;
		},
		get isConfirmed() {
			return isConfirmed;
		},
		setParsedData(newData: Graph) {
			if (newData) {
				parsedData = newData;
				isConfirmed = false;
			}
		},
		confirmData() {
			isConfirmed = true;
		},
		clearData() {
			parsedData = null;
			isConfirmed = false;
		}
	};

	setContext<ParsedFileContext>('parsedFileContext', dataStore);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<nav>
	<a href="/">home</a>
	<a href="/graph">graph</a>
</nav>

{@render children()}
